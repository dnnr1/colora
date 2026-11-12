export type Rgb = {
  r: number
  g: number
  b: number
}

type Scheme = {
  offsets: readonly [number, number, number, number, number]
  weight: number
}

type Tone = 'full' | 'light' | 'deep'
type Mood = 'muted' | 'balanced' | 'vivid'

const SCHEMES: readonly Scheme[] = [
  { offsets: [-52, -26, 0, 26, 52], weight: 3 },
  { offsets: [-10, 0, 10, 170, 190], weight: 3 },
  { offsets: [0, 150, 180, 210, 30], weight: 2 },
  { offsets: [0, 120, 240, 0, 120], weight: 2 },
  { offsets: [0, 0, 0, 0, 0], weight: 1 },
]

const TONES: Readonly<
  Record<Tone, readonly [number, number, number, number, number]>
> = {
  full: [0.3, 0.44, 0.58, 0.74, 0.9],
  light: [0.52, 0.63, 0.74, 0.84, 0.93],
  deep: [0.27, 0.36, 0.46, 0.57, 0.69],
}

const MOODS: Readonly<Record<Mood, number>> = {
  muted: 0.05,
  balanced: 0.09,
  vivid: 0.14,
}

const MOOD_WEIGHTS: ReadonlyArray<readonly [Mood, number]> = [
  ['muted', 3],
  ['balanced', 4],
  ['vivid', 2],
]

const TONE_WEIGHTS: ReadonlyArray<readonly [Tone, number]> = [
  ['full', 5],
  ['light', 3],
  ['deep', 2],
]

const SCHEME_WEIGHTS = SCHEMES.map((scheme) => [scheme, scheme.weight] as const)

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min)

function weightedPick<T>(entries: ReadonlyArray<readonly [T, number]>): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let threshold = Math.random() * total

  for (const [value, weight] of entries) {
    threshold -= weight
    if (threshold <= 0) return value
  }

  return entries[entries.length - 1][0]
}

function srgbToLinear(channel: number) {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(channel: number) {
  const value = clamp(channel)
  const encoded =
    value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return Math.round(clamp(encoded) * 255)
}

function oklabToLinearRgb(
  lightness: number,
  a: number,
  b: number,
): [number, number, number] {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function isInGamut(lightness: number, chroma: number, hue: number) {
  const radians = (hue * Math.PI) / 180
  const [r, g, b] = oklabToLinearRgb(
    lightness,
    chroma * Math.cos(radians),
    chroma * Math.sin(radians),
  )
  const epsilon = 1e-4

  return [r, g, b].every(
    (channel) => channel >= -epsilon && channel <= 1 + epsilon,
  )
}

export function oklchToHex(lightness: number, chroma: number, hue: number) {
  const targetLightness = clamp(lightness, 0.05, 0.98)
  let targetChroma = Math.max(0, chroma)

  if (!isInGamut(targetLightness, targetChroma, hue)) {
    let low = 0
    let high = targetChroma

    for (let i = 0; i < 12; i++) {
      const mid = (low + high) / 2
      if (isInGamut(targetLightness, mid, hue)) {
        low = mid
      } else {
        high = mid
      }
    }

    targetChroma = low
  }

  const radians = (hue * Math.PI) / 180
  const [r, g, b] = oklabToLinearRgb(
    targetLightness,
    targetChroma * Math.cos(radians),
    targetChroma * Math.sin(radians),
  )

  return `#${[r, g, b]
    .map((channel) => linearToSrgb(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

export function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.replace('#', ''), 16)

  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  }
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  )
}

export function contrastRatio(a: string, b: string) {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

function chromaCurve(lightness: number) {
  return 0.55 + 0.9 * Math.sin(Math.PI * lightness)
}

export function generatePalette() {
  const baseHue = Math.random() * 360
  const scheme = weightedPick(SCHEME_WEIGHTS)
  const tone = weightedPick(TONE_WEIGHTS)
  const mood = weightedPick(MOOD_WEIGHTS)
  const baseChroma = MOODS[mood] * randomBetween(0.9, 1.1)

  const lightnesses = TONES[tone]
    .map((lightness) =>
      clamp(lightness + randomBetween(-0.02, 0.02), 0.08, 0.97),
    )
    .sort((a, b) => a - b)

  return lightnesses.map((lightness, index) => {
    const hue =
      (baseHue + scheme.offsets[index] + randomBetween(-5, 5) + 360) % 360
    const chroma = baseChroma * chromaCurve(lightness) * randomBetween(0.9, 1.1)

    return oklchToHex(lightness, chroma, hue)
  })
}
