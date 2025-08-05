import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export const Root = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-neutral-900">
      <Sidebar />
      <main className="relative ml-[280px] flex-1 overflow-auto">
        <div className="container mx-auto max-w-4xl p-6">
          <Outlet />
          <ScrollRestoration />
        </div>
      </main>
    </div>
  )
}