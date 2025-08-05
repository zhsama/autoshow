'use client'

import {
  Home,
  History,
  Package,
  Moon,
  Sun,
  Languages,
  ChevronLeft,
  ChevronDown,
  User,
  LogOut,
  Globe,
  Palette,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useTheme } from 'next-themes'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppSidebar() {
  const t = useTranslations('AppSidebar')
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()

  const items = [
    {
      title: t('navigation.home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('navigation.history'),
      url: '/history',
      icon: History,
    },
    {
      title: t('navigation.collections'),
      url: '/collections',
      icon: Package,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Header with logo and toggle */}
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  AS
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  'h-8 w-8 transition-all duration-300 active:scale-90 active:bg-sidebar-accent/60',
                  state === 'collapsed' && 'ml-0'
                )}
              >
                <ChevronLeft
                  className={cn(
                    'h-4 w-4 transition-transform duration-300 active:scale-110',
                    state === 'collapsed' && 'rotate-180'
                  )}
                />
              </Button>
            </div>
          </div>
        </SidebarHeader>

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-4 py-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.url}
                      className="mx-2 rounded-lg transition-all duration-200 ease-out active:scale-95 active:bg-sidebar-accent/80"
                    >
                      <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-active/menu-item:scale-105" />
                      {state !== 'collapsed' && (
                        <span className="ml-3 transition-all duration-200 ease-out">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer with user profile and settings */}
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="space-y-2">
            {/* Language Selection */}
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Language"
                      className="transition-all duration-200 ease-out active:scale-95 active:bg-sidebar-accent/80"
                    >
                      <Languages className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-active/menu-item:scale-105" />
                      {state !== 'collapsed' && (
                        <span className={cn('transition-all duration-300')}>
                          {t('language')}
                        </span>
                      )}
                      {state !== 'collapsed' && (
                        <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground transition-transform duration-200 ease-out group-active/menu-item:rotate-180" />
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={pathname} locale="en">
                        <Globe className="mr-2 h-4 w-4" />
                        English
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={pathname} locale="zh">
                        <Globe className="mr-2 h-4 w-4" />
                        中文
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Theme Toggle */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  tooltip="Toggle theme"
                  className="transition-all duration-200 ease-out active:scale-95 active:bg-sidebar-accent/80"
                >
                  <Moon className="h-5 w-5 shrink-0 dark:hidden transition-transform duration-200 ease-out group-active/menu-item:scale-105 group-active/menu-item:rotate-12" />
                  <Sun className="h-5 w-5 shrink-0 hidden dark:block transition-transform duration-200 ease-out group-active/menu-item:scale-105 group-active/menu-item:rotate-12" />
                  {state !== 'collapsed' && (
                    <span className="transition-all duration-300">
                      {t('theme')}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 rounded-lg hover:bg-sidebar-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  {state !== 'collapsed' && (
                    <>
                      <div className="ml-3 text-left flex-1">
                        <p className="text-sm font-medium text-sidebar-foreground">
                          AutoShow
                        </p>
                        <p className="text-xs text-muted-foreground">
                          admin@autoshow.com
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {t('user.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="mr-2 h-4 w-4" />
                  {t('user.theme')}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('user.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
