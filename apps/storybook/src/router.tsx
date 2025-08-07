import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { routeKeys } from './glob'
import { ComponentPage } from './routes/component'
import { HomePage } from './routes/home'
import { Root } from './routes/root'

// 创建路由配置
export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {/* 首页 */}
      <Route index element={<HomePage />} />

      {/* 动态组件路由 */}
      {routeKeys.map(componentName => (
        <Route
          key={componentName}
          path={`/${componentName}`}
          element={<ComponentPage />}
        />
      ))}

      {/* 404 页面 */}
      <Route
        path="*"
        element={(
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                页面未找到
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                请检查 URL 是否正确
              </p>
            </div>
          </div>
        )}
      />
    </Route>,
  ),
)

export { routeKeys }
