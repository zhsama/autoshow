'use client'

import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { transitionViewIfSupported } from '@/lib/dom'
import { useIsClient } from '@/hooks/use-is-client'

const themeConfig = {
  light: { icon: Sun, label: 'Light', ariaLabel: 'Switch to light theme' },
  system: {
    icon: Monitor,
    label: 'System',
    ariaLabel: 'Switch to system theme',
  },
  dark: { icon: Moon, label: 'Dark', ariaLabel: 'Switch to dark theme' },
} as const

export const AdvancedThemeSwitcher = () => {
  return (
    <div className="relative inline-block">
      <ThemeIndicator />
      <ButtonGroup />
    </div>
  )
}

const ThemeIndicator = () => {
  const { theme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) return null
  if (!theme) return null

  const positions = { light: 4, system: 44, dark: 84 }
  const currentPosition =
    positions[theme as keyof typeof positions] || positions.system

  return (
    <div
      className="absolute top-[4px] z-[-1] size-[32px] rounded-lg bg-primary/10 shadow-soft-sm duration-200 ease-out"
      style={{
        left: currentPosition,
      }}
    />
  )
}

const ButtonGroup = () => {
  const { setTheme } = useTheme()

  const buildThemeTransition = (theme: 'light' | 'dark' | 'system') => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(theme))
    })
  }

  return (
    <div className="inline-flex rounded-xl border border-border bg-background/80 backdrop-blur-sm p-[4px] shadow-soft-sm">
      {Object.entries(themeConfig).map(([themeKey, config]) => {
        const { icon: Icon, ariaLabel } = config

        return (
          <button
            key={themeKey}
            aria-label={ariaLabel}
            type="button"
            className={cn(
              'inline-flex h-[32px] w-[32px] items-center justify-center rounded-lg',
              'text-muted-foreground transition-all duration-200 ease-out',
              'hover:text-foreground hover:bg-accent/50',
              'active:scale-95 active:bg-accent/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            onClick={() => {
              buildThemeTransition(themeKey as 'light' | 'dark' | 'system')
            }}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}

// Compact version for use in sidebars or tight spaces
export const CompactThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) return null

  const currentTheme = theme || 'system'
  const nextTheme =
    currentTheme === 'light'
      ? 'dark'
      : currentTheme === 'dark'
        ? 'system'
        : 'light'
  const CurrentIcon =
    themeConfig[currentTheme as keyof typeof themeConfig]?.icon || Monitor

  const handleToggle = () => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(nextTheme))
    })
  }

  return (
    <button
      aria-label={`Current theme: ${currentTheme}. Click to switch to ${nextTheme}`}
      type="button"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg',
        'text-muted-foreground transition-all duration-200 ease-out',
        'hover:text-foreground hover:bg-accent/50',
        'active:scale-95 active:bg-accent/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
      onClick={handleToggle}
    >
      <CurrentIcon className="h-4 w-4" />
    </button>
  )
}
