'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsClient } from '@/hooks/use-is-client'
import { transitionViewIfSupported } from '@/lib/dom'

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const isClient = useIsClient()

  const buildThemeTransition = (theme: 'light' | 'dark' | 'system') => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(theme))
    })
  }

  if (!isClient) {
    return (
      <Button variant="outline" size="icon" className="theme-transition">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="theme-transition">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-fade-in">
        <DropdownMenuItem onClick={() => buildThemeTransition('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => buildThemeTransition('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => buildThemeTransition('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  const buildThemeTransition = (newTheme: string) => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(newTheme))
    })
  }

  if (!isClient) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="theme-transition hover:audio-glow-sm"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const getNextTheme = (currentTheme: string | undefined) => {
    switch (currentTheme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      case 'system':
        return 'light'
      default:
        return 'dark'
    }
  }

  const nextTheme = getNextTheme(theme)

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => buildThemeTransition(nextTheme)}
      className="theme-transition hover:audio-glow-sm"
      aria-label={`Current theme: ${theme || 'system'}. Click to switch to ${nextTheme}`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
