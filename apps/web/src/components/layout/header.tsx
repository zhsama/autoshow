'use client'

import * as React from 'react'
import {
  Search,
  Bell,
  Settings,
  Menu,
  Upload,
  Mic,
  Headphones,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '@/components/ui/sidebar'

interface HeaderProps {
  className?: string
  showSearch?: boolean
  showActions?: boolean
}

export function Header({
  className,
  showSearch = true,
  showActions = true,
}: HeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Page Title or Breadcrumb */}
          <div className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold hidden sm:block">AutoShow</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audio files, transcripts..."
                className="pl-10 pr-4 bg-muted/50 border-border focus:bg-background transition-colors"
              />
            </div>
          </div>
        )}

        {/* Right Section - Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {/* Upload Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            {/* Record Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Mic className="h-4 w-4 mr-2" />
              Record
            </Button>

            {/* Mobile Upload/Record */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload or Record</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mic className="mr-2 h-4 w-4" />
                  Record Audio
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b border-border">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 3 new notifications
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                    <p className="font-medium text-sm">
                      Transcription Complete
                    </p>
                    <p className="text-xs text-muted-foreground">
                      "Meeting_2024.mp3" has been successfully transcribed
                    </p>
                    <span className="text-xs text-muted-foreground">
                      2 minutes ago
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                    <p className="font-medium text-sm">Processing Started</p>
                    <p className="text-xs text-muted-foreground">
                      "Podcast_Episode_5.wav" is being processed
                    </p>
                    <span className="text-xs text-muted-foreground">
                      5 minutes ago
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                    <p className="font-medium text-sm">Upload Failed</p>
                    <p className="text-xs text-muted-foreground">
                      "Large_file.mp4" upload failed. Please try again.
                    </p>
                    <span className="text-xs text-muted-foreground">
                      10 minutes ago
                    </span>
                  </DropdownMenuItem>
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Processing Settings</DropdownMenuItem>
                <DropdownMenuItem>Export Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Help & Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audio files, transcripts..."
              className="pl-10 pr-4 bg-muted/50 border-border focus:bg-background transition-colors"
            />
          </div>
        </div>
      )}
    </header>
  )
}

// Specialized header variants
export function SimpleHeader({ className, ...props }: HeaderProps) {
  return <Header className={className} showSearch={false} {...props} />
}

export function CompactHeader({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" />
          <h1 className="text-base font-medium">AutoShow</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
