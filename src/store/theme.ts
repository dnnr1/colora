import { create } from 'zustand'

export type Theme = 'dark' | 'light'

type ThemeStore = {
  theme: Theme
  hydrate: () => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const STORAGE_KEY = 'colora-theme'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark',
  hydrate: () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        applyTheme(stored)
        set({ theme: stored })
      }
    } catch {}
  },
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  },
  toggleTheme: () => {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark')
  },
}))
