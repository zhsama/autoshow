import type * as React from 'react'

export interface DocumentComponent<T = unknown> extends React.FC<T> {
  meta?: Partial<{
    title?: string
    /**
     * @description Markdown support
     */
    description?: string
    /**
     * @description Component category for grouping
     */
    category?: string
    /**
     * @description Usage examples or notes
     */
    examples?: string[]
  }>
}

export interface DocumentPageMeta {
  title: string
  description?: string
  category?: string
}

export interface ComponentRoute {
  path: string
  componentName: string
  category?: string
}

export interface ComponentModule {
  [key: string]: DocumentComponent | DocumentPageMeta
}