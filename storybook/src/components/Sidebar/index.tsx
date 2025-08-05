import * as ScrollArea from '@radix-ui/react-scroll-area'
import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { getComponentsByCategory } from '../../glob'
import { useDarkMode } from '../../hooks/use-dark'

export const Sidebar: FC = () => {
  const { pathname } = useLocation()
  const componentsByCategory = getComponentsByCategory()

  return (
    <ScrollArea.Root className="z-10 !absolute inset-y-0 left-0 w-[280px] border-r border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <ScrollArea.Viewport className="!inline-block !w-[280px] !min-w-[auto]">
        <div className="flex h-screen flex-col">
          {/* Header */}
          <div className="shrink-0 border-b border-slate-200 px-4 py-6 dark:border-neutral-800">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              AutoShow
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Component Playground
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            {Object.entries(componentsByCategory).map(([category, components]) => (
              <div key={category} className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-slate-900 dark:text-white uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {components.map((component) => {
                    const isActive = pathname === component.path
                    
                    return (
                      <li key={component.componentName}>
                        <Link
                          to={component.path}
                          className={[
                            'group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-neutral-800 dark:hover:text-white',
                          ].join(' ')}
                        >
                          <span className="truncate">
                            {formatComponentName(component.componentName)}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer with Dark Mode Toggle */}
          <div className="shrink-0 border-t border-slate-200 p-4 dark:border-neutral-800">
            <DarkModeToggle />
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-slate-100 p-0.5 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-300 dark:bg-neutral-600" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

const DarkModeToggle: FC = () => {
  const { isDark, toggle } = useDarkMode()
  
  return (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      aria-label="Toggle Dark Mode"
    >
      <span>切换主题</span>
      {isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  )
}

// 格式化组件名称显示
function formatComponentName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}