import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return JSON.parse(stored)
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement

    if (isDark) {
      root.classList.add('dark')
    }
    else {
      root.classList.remove('dark')
    }

    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDark))
  }, [isDark])

  const toggle = () => setIsDark(!isDark)

  return { isDark, toggle, setDark: setIsDark }
}
