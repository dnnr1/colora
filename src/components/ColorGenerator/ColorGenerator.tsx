import { useEffect } from 'react'
import Button from '#/components/Button'
import { contrastRatio } from '#/lib/color'
import { usePaletteStore } from '#/store/palette'

const DARK_INK = '#12110f'
const LIGHT_INK = '#faf8f2'

function readableInk(hex: string) {
  return contrastRatio(hex, DARK_INK) >= contrastRatio(hex, LIGHT_INK)
    ? DARK_INK
    : LIGHT_INK
}

export default function ColorGenerator() {
  const colors = usePaletteStore((state) => state.colors)
  const copied = usePaletteStore((state) => state.copied)
  const copiedAll = usePaletteStore((state) => state.copiedAll)
  const generate = usePaletteStore((state) => state.generate)
  const copy = usePaletteStore((state) => state.copy)
  const copyAll = usePaletteStore((state) => state.copyAll)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space' || event.repeat) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest(
          'input, textarea, select, button, [contenteditable="true"]',
        )
      ) {
        return
      }
      event.preventDefault()
      generate()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [generate])

  return (
    <section aria-label="Color palette">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:h-[340px] sm:grid-cols-5 lg:h-[360px]">
        {colors.map((color, index) => {
          const ink = readableInk(color)
          const isCopied = copied === color

          return (
            <button
              key={`${color}-${index}`}
              type="button"
              onClick={() => void copy(color)}
              aria-label={`Copy ${color.toUpperCase()}`}
              title={`Copy ${color.toUpperCase()}`}
              className="group relative flex min-h-20 cursor-pointer flex-col justify-between p-4 text-left transition-all duration-200 hover:brightness-105 focus-visible:-outline-offset-2 sm:min-h-0"
              style={{ backgroundColor: color, color: ink }}
            >
              <span className="font-mono text-[10px] tracking-[0.18em] opacity-55">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[13px] uppercase tracking-wide">
                  {isCopied ? 'Copied' : color.toUpperCase()}
                </span>
                {!isCopied && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-0 transition-opacity group-hover:opacity-55 group-focus-visible:opacity-55">
                    Copy
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button text="Generate" onClick={generate} />

        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          or press{' '}
          <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink">
            space
          </kbd>
        </span>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:inline">
            {colors.length} colors
          </span>
          <button
            type="button"
            onClick={() => void copyAll()}
            className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm text-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            {copiedAll ? 'Copied all' : 'Copy all'}
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied
          ? `${copied.toUpperCase()} copied to clipboard`
          : copiedAll
            ? 'All colors copied to clipboard'
            : ''}
      </p>
    </section>
  )
}
