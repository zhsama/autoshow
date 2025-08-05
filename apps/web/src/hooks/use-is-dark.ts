import { useTheme } from 'next-themes'

export const useIsDark = () => {
  const { theme, systemTheme } = useTheme()

  if (theme === 'dark') return true

  if (theme === 'system') {
    return systemTheme === 'dark'
  }

  return false
}
