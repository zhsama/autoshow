import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export interface MetadataOptions {
  locale: string
  page?: 'home' | 'collections' | 'history' | 'show-notes' | 'docs'
  title?: string
  description?: string
  keywords?: string[]
  showNote?: {
    id: string
    title: string
    description: string
  }
}

export async function generatePageMetadata({
  locale,
  page = 'home',
  title,
  description,
  keywords = [],
  showNote,
}: MetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoshow.ai'

  // 页面特定的默认标题和描述
  const getPageDefaults = () => {
    switch (page) {
      case 'home':
        return {
          title: t('seo.home.title'),
          description: t('seo.home.description'),
        }
      case 'collections':
        return {
          title: t('seo.collections.title'),
          description: t('seo.collections.description'),
        }
      case 'history':
        return {
          title: t('seo.history.title'),
          description: t('seo.history.description'),
        }
      case 'show-notes':
        return {
          title: showNote
            ? `${showNote.title} - ${t('seo.showNotes.titleSuffix')}`
            : t('seo.showNotes.title'),
          description: showNote
            ? showNote.description
            : t('seo.showNotes.description'),
        }
      case 'docs':
        return {
          title: t('seo.docs.title'),
          description: t('seo.docs.description'),
        }
      default:
        return {
          title: t('site.name'),
          description: t('site.description'),
        }
    }
  }

  const defaults = getPageDefaults()
  const pageTitle = title || defaults.title
  const pageDescription = description || defaults.description

  // 基础关键词 + 页面特定关键词
  const baseKeywords = [
    'AI transcription',
    'audio processing',
    'show notes',
    'podcast automation',
    'video transcription',
    'content generation',
  ]

  const pageKeywords = [...baseKeywords, ...keywords]

  // 构建完整URL
  const pageUrl = showNote
    ? `${siteUrl}/${locale}/show-notes/${showNote.id}`
    : `${siteUrl}/${locale}${page === 'home' ? '' : `/${page}`}`

  return {
    title: {
      template: `%s | ${t('site.name')}`,
      default: pageTitle,
    },
    description: pageDescription,
    keywords: pageKeywords.join(', '),

    // 国际化和规范化URL
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl.replace(`/${locale}/`, '/en/'),
        zh: pageUrl.replace(`/${locale}/`, '/zh/'),
        'x-default': pageUrl.replace(`/${locale}/`, '/en/'),
      },
    },

    // Open Graph
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: t('site.name'),
      locale: locale,
      type: showNote ? 'article' : 'website',
      images: [
        {
          url: `${siteUrl}/og/${locale}/${page}${showNote ? `/${showNote.id}` : ''}.png`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [
        `${siteUrl}/og/${locale}/${page}${showNote ? `/${showNote.id}` : ''}.png`,
      ],
    },

    // 搜索引擎指令
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 额外元数据
    authors: [{ name: 'AutoShow Team' }],
    creator: 'AutoShow',
    publisher: 'AutoShow',
    category: 'Technology',

    // Show Notes特定的文章元数据
    ...(showNote && {
      other: {
        'article:published_time': new Date().toISOString(),
        'article:modified_time': new Date().toISOString(),
        'article:section': 'Show Notes',
        'article:tag': pageKeywords.slice(0, 5).join(','),
      },
    }),
  }
}

// 快捷函数：为特定页面生成元数据
export const generateHomeMetadata = (locale: string) =>
  generatePageMetadata({ locale, page: 'home' })

export const generateCollectionsMetadata = (locale: string) =>
  generatePageMetadata({ locale, page: 'collections' })

export const generateHistoryMetadata = (locale: string) =>
  generatePageMetadata({ locale, page: 'history' })

export const generateShowNoteMetadata = (
  locale: string,
  showNote: MetadataOptions['showNote']
) => generatePageMetadata({ locale, page: 'show-notes', showNote })
