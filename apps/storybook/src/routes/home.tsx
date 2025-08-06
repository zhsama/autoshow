import { Link } from 'react-router-dom'
import { getComponentsByCategory } from '../glob'

export const HomePage = () => {
  const componentsByCategory = getComponentsByCategory()
  const totalComponents = Object.values(componentsByCategory).flat().length

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          AutoShow 组件库
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          高性能组件展示系统 · 基于 Vite + React Router · 5-10x 性能提升
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalComponents}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              总组件数
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(componentsByCategory).length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              分类数量
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="space-y-12">
        {Object.entries(componentsByCategory).map(([category, components]) => (
          <div key={category}>
            <div className="mb-6 border-b border-slate-200 pb-2 dark:border-neutral-800">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {formatCategoryName(category)}
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {components.length} 个组件
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => (
                <Link
                  key={component.componentName}
                  to={component.path}
                  className="group block rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {formatComponentName(component.componentName)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      查看组件示例和用法
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                    查看详情
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-16 border-t border-slate-200 pt-12 dark:border-neutral-800">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          特性
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-lg font-medium text-slate-900 dark:text-white">
              ⚡ 极致性能
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              基于 Vite 构建，比传统 Storybook 快 5-10 倍
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium text-slate-900 dark:text-white">
              🔍 自动发现
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              自动扫描 .demo.tsx 文件，无需手动配置
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium text-slate-900 dark:text-white">
              🎨 现代设计
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              基于 Tailwind CSS，支持深色模式
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 格式化分类名称
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    ui: 'UI 组件',
    forms: '表单组件',
    layout: '布局组件',
    data: '数据组件',
    feedback: '反馈组件',
    navigation: '导航组件'
  }
  
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// 格式化组件名称
function formatComponentName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}