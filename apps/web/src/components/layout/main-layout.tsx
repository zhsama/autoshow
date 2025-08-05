'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Header } from './header'
import { AudioPlayerPanel } from './audio-player-panel'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showAudioPlayer?: boolean
}

export function MainLayout({
  children,
  className,
  showAudioPlayer = true,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className={cn('min-h-screen bg-background flex', className)}>
        {/* Sidebar - hidden on mobile, shown on tablet+ */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Content Container with responsive layout */}
          <div className="flex-1 flex relative">
            {/* Main Content */}
            <main
              className={cn(
                'flex-1 flex flex-col',
                // Mobile: full width
                'w-full',
                // Desktop: leave space for audio player panel if shown
                showAudioPlayer && 'xl:mr-80'
              )}
            >
              <div className="flex-1 container mx-auto px-4 py-6">
                {children}
              </div>

              {/* Mobile Audio Player - bottom sticky */}
              {showAudioPlayer && (
                <div className="xl:hidden">
                  <AudioPlayerPanel isMobile />
                </div>
              )}
            </main>

            {/* Desktop Audio Player Panel - right side */}
            {showAudioPlayer && (
              <aside className="hidden xl:flex w-80 border-l border-border bg-card">
                <AudioPlayerPanel />
              </aside>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

interface LayoutSectionProps {
  children: React.ReactNode
  className?: string
}

// Layout utility components
export function LayoutHeader({ children, className }: LayoutSectionProps) {
  return (
    <header className={cn('border-b border-border bg-card', className)}>
      {children}
    </header>
  )
}

export function LayoutMain({ children, className }: LayoutSectionProps) {
  return (
    <main className={cn('flex-1 container mx-auto px-4 py-6', className)}>
      {children}
    </main>
  )
}

export function LayoutSidebar({ children, className }: LayoutSectionProps) {
  return (
    <aside
      className={cn(
        'w-80 border-l border-border bg-card',
        'hidden lg:flex',
        className
      )}
    >
      {children}
    </aside>
  )
}

// Responsive container components
export function ResponsiveContainer({
  children,
  className,
}: LayoutSectionProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4',
        // Mobile
        'max-w-full',
        // Tablet
        'sm:max-w-screen-sm sm:px-6',
        'md:max-w-screen-md',
        // Desktop
        'lg:max-w-screen-lg lg:px-8',
        'xl:max-w-screen-xl',
        '2xl:max-w-screen-2xl',
        className
      )}
    >
      {children}
    </div>
  )
}

// Grid layouts for different breakpoints
export function ResponsiveGrid({ children, className }: LayoutSectionProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        // Mobile: 1 column
        'grid-cols-1',
        // Tablet: 2 columns
        'md:grid-cols-2',
        // Desktop: 3 columns
        'xl:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}

// Audio-specific layout components
export function AudioLayoutGrid({ children, className }: LayoutSectionProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        // Mobile: 1 column, stacked vertically
        'grid-cols-1',
        // Tablet: 2 columns, sidebar + content
        'lg:grid-cols-[280px_1fr]',
        // Desktop: 3 columns, sidebar + content + audio panel
        'xl:grid-cols-[280px_1fr_320px]',
        className
      )}
    >
      {children}
    </div>
  )
}
