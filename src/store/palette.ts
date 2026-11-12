import { create } from 'zustand'
import { copyText } from '#/lib/clipboard'
import { generatePalette } from '#/lib/color'

const INITIAL_PALETTE = ['#1f2d2b', '#3f5d53', '#7d9d8c', '#d8c3a5', '#f0e9dd']

type PaletteStore = {
  colors: string[]
  copied: string | null
  copiedAll: boolean
  generate: () => void
  copy: (hex: string) => Promise<void>
  copyAll: () => Promise<void>
}

let feedbackTimer: ReturnType<typeof setTimeout> | undefined

function clearFeedbackTimer() {
  if (feedbackTimer !== undefined) {
    clearTimeout(feedbackTimer)
    feedbackTimer = undefined
  }
}

export const usePaletteStore = create<PaletteStore>((set, get) => {
  function flash(hex: string | null, all = false) {
    clearFeedbackTimer()
    set({ copied: hex, copiedAll: all })
    feedbackTimer = setTimeout(() => {
      set({ copied: null, copiedAll: false })
      feedbackTimer = undefined
    }, 1400)
  }

  return {
    colors: INITIAL_PALETTE,
    copied: null,
    copiedAll: false,
    generate: () => {
      clearFeedbackTimer()
      set({ colors: generatePalette(), copied: null, copiedAll: false })
    },
    copy: async (hex) => {
      if (await copyText(hex.toUpperCase())) {
        flash(hex)
      }
    },
    copyAll: async () => {
      const palette = get()
        .colors.map((color) => color.toUpperCase())
        .join(', ')

      if (await copyText(palette)) {
        flash(null, true)
      }
    },
  }
})
