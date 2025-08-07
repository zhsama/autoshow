import React, { lazy, Suspense } from 'react'

interface DynamicOptions {
  loading?: () => React.ReactNode
  ssr?: boolean
}

export default function dynamic<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options?: DynamicOptions,
): T {
  const LazyComponent = lazy(loader)

  const DynamicComponent = (props: React.ComponentProps<T>) => {
    const LoadingComponent = options?.loading || (() => <div>Loading...</div>)

    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }

  return DynamicComponent as T
}
