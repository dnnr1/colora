import ColorGenerator from '#/components/ColorGenerator'
import Header from '#/components/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Palette generator
            </p>
            <h1 className="mt-4 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Five colors,
              <br className="hidden sm:block" /> one press.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              A fresh palette every time. Click a swatch to copy its hex value.
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <ColorGenerator />
          </div>
        </div>
      </main>
    </div>
  )
}
