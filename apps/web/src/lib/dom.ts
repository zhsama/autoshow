export const transitionViewIfSupported = (callback: () => void) => {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    // 使用类型断言处理实验性API
    ;(
      document as { startViewTransition?: (callback: () => void) => void }
    ).startViewTransition?.(callback)
  } else {
    callback()
  }
}

export const getCurrentThemeFromDOM = (): 'light' | 'dark' | null => {
  if (typeof document === 'undefined') return null

  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  } else if (document.documentElement.classList.contains('light')) {
    return 'light'
  }

  return null
}

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}
