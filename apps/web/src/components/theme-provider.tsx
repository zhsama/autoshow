'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="autoshow-theme"
      themes={['light', 'dark', 'system']}
      enableColorScheme={false}
      forcedTheme={undefined}
    >
      {children}
    </NextThemesProvider>
  )
}
