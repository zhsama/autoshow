import { useParams } from 'react-router-dom'
import { getComponentInfo } from '../glob'

export function ComponentPage() {
  const { componentName } = useParams<{ componentName: string }>()

  if (!componentName) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">组件未找到</p>
      </div>
    )
  }

  const componentInfo = getComponentInfo(componentName)

  if (!componentInfo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            组件 "
            {componentName}
            " 未找到
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            请确保已创建对应的 .demo.tsx 文件
          </p>
        </div>
      </div>
    )
  }

  const { components, metadata } = componentInfo

  return (
    <div className="space-y-8">
      {/* Page Header */}
      {metadata && (
        <div className="border-b border-slate-200 pb-6 dark:border-neutral-800">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {metadata.title}
          </h1>
          {metadata.description && (
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              {metadata.description}
            </p>
          )}
          {metadata.category && (
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {metadata.category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Component Demos */}
      <div className="space-y-12">
        {components.map(([exportName, Component]) => (
          <div key={exportName} className="space-y-4">
            {/* Demo Header */}
            <div className="border-b border-slate-100 pb-3 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {Component.meta?.title || formatExportName(exportName)}
              </h2>
              {Component.meta?.description && (
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  {Component.meta.description}
                </p>
              )}
            </div>

            {/* Demo Component */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-center min-h-[200px]">
                <Component />
              </div>
            </div>

            {/* Component Examples */}
            {Component.meta?.examples && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                  使用示例
                </h3>
                <div className="space-y-1">
                  {Component.meta.examples.map((example, index) => (
                    <p key={index} className="text-sm text-slate-600 dark:text-slate-400">
                      •
                      {' '}
                      {example}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// 格式化导出名称
function formatExportName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}
