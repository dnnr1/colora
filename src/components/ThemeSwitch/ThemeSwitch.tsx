import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useThemeStore } from '#/store/theme'

export default function ThemeSwitch() {
  const theme = useThemeStore((state) => state.theme)
  const hydrate = useThemeStore((state) => state.hydrate)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  )
}
