"use client"

import * as React from "react"

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [mounted, setMounted] = React.useState(false)
  const [theme, setThemeState] = React.useState<Theme>('system')

  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(savedTheme)
    } else {
      // If no theme saved, check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(systemTheme);
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.remove('light', 'dark')
    if (newTheme !== 'system') {
      document.documentElement.classList.add(newTheme)
    } else {
      // For system, reflect actual system preference on the class
      const systemActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemActualTheme);
    }
  }

  // This toggle function was slightly different from what was in ThemeProvider
  // The one in ThemeProvider was a simple light/dark toggle and didn't handle 'system'
  // This version is more robust if we want a direct toggle that cycles or respects system.
  // For now, let's keep the setTheme function which is more explicit.
  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light'; // Simplified toggle
  //   setTheme(newTheme);
  // };

  if (!mounted) {
    // Return a non-functional setTheme during SSR or before mount to avoid hydration issues
    // and default to 'system' or a sensible default.
    return { theme: 'system' as Theme, setTheme: (_: Theme) => {} }
  }

  return { theme, setTheme }
}
