import ThemeSwitch from '#/components/ThemeSwitch'
import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          aria-label="Colora home"
          className="rounded-sm text-[25px] font-semibold tracking-[-0.01em]"
        >
          Colora
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
            Palette studio
          </span>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
