import type { ReactNode } from 'react'
import { StructuredData } from './StructuredData'
import type {
  StructuredDataOptions,
  StructuredDataContent,
} from '@/lib/seo/structured-data'

interface SEOProviderProps {
  children: ReactNode
  locale: string
  page: string
  structuredData?: Array<{
    type: StructuredDataOptions['type']
    data?: StructuredDataContent
  }>
  breadcrumbs?: Array<{
    name: string
    url: string
  }>
  showNote?: {
    id: string
    title: string
    description: string
    publishedAt?: string
    updatedAt?: string
  }
}

export function SEOProvider({
  children,
  locale,
  page,
  structuredData = [],
  breadcrumbs,
  showNote,
}: SEOProviderProps) {
  // 获取页面特定的SEO配置
  const pageConfig = getPageSEOConfig(page)
  const allStructuredData = [...pageConfig.structuredData, ...structuredData]

  return (
    <>
      {/* 默认的组织和软件应用结构化数据 */}
      <StructuredData type="organization" locale={locale} />
      <StructuredData type="software" locale={locale} />

      {/* 面包屑导航（如果提供） */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <StructuredData
          type="breadcrumb"
          locale={locale}
          data={{ breadcrumbs }}
        />
      )}

      {/* Show Notes特定的文章结构化数据 */}
      {showNote && (
        <StructuredData
          type="article"
          locale={locale}
          data={{
            title: showNote.title,
            description: showNote.description,
            publishedAt: showNote.publishedAt,
            updatedAt: showNote.updatedAt,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://autoshow.ai'}/${locale}/show-notes/${showNote.id}`,
            category: 'Show Notes',
            keywords: [
              'AI transcription',
              'show notes',
              'audio processing',
              'podcast',
            ],
          }}
        />
      )}

      {/* 页面特定的结构化数据 */}
      {allStructuredData.map((schema, index) => (
        <StructuredData
          key={`${schema.type}-${index}`}
          type={schema.type}
          locale={locale}
          data={schema.data}
        />
      ))}

      {children}
    </>
  )
}

// 预设的SEO配置
export const SEO_CONFIGS = {
  home: {
    structuredData: [{ type: 'howto' as const }],
  },
  collections: {
    structuredData: [{ type: 'faq' as const }],
  },
  history: {
    structuredData: [],
  },
  'show-notes': {
    structuredData: [],
  },
} as const

// 快捷函数：获取页面的默认SEO配置
export function getPageSEOConfig(page: string) {
  return SEO_CONFIGS[page as keyof typeof SEO_CONFIGS] || { structuredData: [] }
}
