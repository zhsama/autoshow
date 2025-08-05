import type { ComponentModule, ComponentRoute, DocumentComponent, DocumentPageMeta } from '../typings'

// 自动发现所有.demo.tsx文件
const modules = import.meta.glob('../../../apps/web/src/components/**/*.demo.tsx', {
  eager: true
}) as Record<string, ComponentModule>

// 解析组件路由
export const componentRoutes: ComponentRoute[] = []
export const routeKeys: string[] = []

// 处理发现的组件
Object.entries(modules).forEach(([path, module]) => {
  // 从路径中提取组件名称
  // 例如: ../../../apps/web/src/components/ui/button.demo.tsx -> button
  const match = path.match(/\/([^\/]+)\.demo\.tsx$/)
  if (!match) return
  
  const componentName = match[1]
  
  // 提取分类（从路径中的文件夹名）
  const categoryMatch = path.match(/\/components\/([^\/]+)\//)
  const category = categoryMatch?.[1] || 'ui'
  
  componentRoutes.push({
    path: `/${componentName}`,
    componentName,
    category
  })
  
  routeKeys.push(componentName)
})

// 排序路由
componentRoutes.sort((a, b) => {
  // 先按类别排序，再按名称排序
  if (a.category !== b.category) {
    return a.category!.localeCompare(b.category!)
  }
  return a.componentName.localeCompare(b.componentName)
})

routeKeys.sort()

// 获取组件模块
export function getComponentModule(componentName: string): ComponentModule | null {
  const modulePath = Object.keys(modules).find(path => 
    path.endsWith(`/${componentName}.demo.tsx`)
  )
  
  return modulePath ? modules[modulePath] : null
}

// 获取组件信息
export function getComponentInfo(componentName: string) {
  const module = getComponentModule(componentName)
  if (!module) return null
  
  // 查找导出的组件和元数据
  const componentExports = Object.entries(module).filter(([key, value]) => 
    typeof value === 'function' && key !== 'metadata'
  ) as [string, DocumentComponent][]
  
  const metadata = module.metadata as DocumentPageMeta | undefined
  
  return {
    components: componentExports,
    metadata,
    route: componentRoutes.find(r => r.componentName === componentName)
  }
}

// 按类别分组组件
export function getComponentsByCategory() {
  const groups: Record<string, ComponentRoute[]> = {}
  
  componentRoutes.forEach(route => {
    const category = route.category || 'other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(route)
  })
  
  return groups
}