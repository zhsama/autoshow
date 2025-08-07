interface HowToStepData {
  name: string
  description: string
  image?: string
  url?: string
}

interface FAQData {
  question: string
  answer: string
}

interface BreadcrumbData {
  name: string
  url: string
}

interface ArticleData {
  title?: string
  description?: string
  publishedAt?: string
  updatedAt?: string
  image?: string
  category?: string
  keywords?: string[]
  wordCount?: number
  url?: string
}

interface HowToData {
  title?: string
  description?: string
  slug?: string
  duration?: string
  steps?: HowToStepData[]
}

interface FAQPageData {
  faqs?: FAQData[]
}

interface BreadcrumbListData {
  breadcrumbs?: BreadcrumbData[]
}

type StructuredDataContent =
  | HowToData
  | FAQPageData
  | BreadcrumbListData
  | ArticleData
  | Record<string, unknown>

export type { StructuredDataContent }

export interface StructuredDataOptions {
  type: 'software' | 'howto' | 'faq' | 'organization' | 'article' | 'breadcrumb'
  locale: string
  data?: StructuredDataContent
}

export function generateStructuredData({
  type,
  locale,
  data,
}: StructuredDataOptions) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoshow.ai'

  switch (type) {
    case 'software':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AutoShow',
        description:
          locale === 'zh'
            ? '使用AI自动生成音视频内容的专业级节目笔记，支持多种音频格式和语言'
            : 'AI-powered professional show notes generator for audio and video content with multi-format and multi-language support',
        url: `${siteUrl}/${locale}`,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'ContentCreationApplication',
        operatingSystem: 'Web Browser',

        // 定价信息
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },

        // 开发者/组织信息
        author: {
          '@type': 'Organization',
          name: 'AutoShow',
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
        },

        // 应用截图
        screenshot: `${siteUrl}/screenshots/main-interface.png`,

        // 功能特性列表
        featureList:
          locale === 'zh'
            ? [
                'AI智能转录技术',
                '自动化节目笔记生成',
                '多语言支持（中英文等）',
                '自定义模板系统',
                '多种导出格式',
                '云端存储集成',
                'API接口支持',
              ]
            : [
                'AI-powered transcription',
                'Automated show notes generation',
                'Multi-language support',
                'Custom templates',
                'Multiple export formats',
                'Cloud storage integration',
                'API integration',
              ],

        // 支持的文件格式
        supportedFormat: [
          'audio/mp3',
          'audio/wav',
          'audio/m4a',
          'video/mp4',
          'video/mov',
          'video/avi',
        ],

        // 评分信息（可选）
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
          bestRating: '5',
          worstRating: '1',
        },

        // 软件版本
        softwareVersion: '1.0.0',
        releaseNotes:
          locale === 'zh'
            ? 'AI转录技术全面升级，支持更多音频格式和语言'
            : 'Major AI transcription upgrade with enhanced format and language support',
      }

    case 'howto':
      return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name:
          (data as HowToData)?.title ||
          (locale === 'zh'
            ? '如何使用AutoShow生成节目笔记'
            : 'How to Generate Show Notes with AutoShow'),
        description:
          (data as HowToData)?.description ||
          (locale === 'zh'
            ? '使用AutoShow AI工具从音视频文件自动生成专业节目笔记的完整指南'
            : 'Complete guide to automatically generate professional show notes from audio/video files using AutoShow AI'),
        image: `${siteUrl}/tutorials/${(data as HowToData)?.slug || 'how-to-use-autoshow'}.jpg`,
        totalTime: (data as HowToData)?.duration || 'PT10M',
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: '0',
        },
        supply:
          locale === 'zh'
            ? ['音频或视频文件', '稳定的网络连接', 'AutoShow账户']
            : [
                'Audio or video file',
                'Stable internet connection',
                'AutoShow account',
              ],
        tool: [
          {
            '@type': 'HowToTool',
            name: 'AutoShow Platform',
            url: `${siteUrl}/${locale}`,
          },
        ],
        step: (data as HowToData)?.steps?.map(
          (step: HowToStepData, index: number) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.description,
            image: step.image,
            url: step.url,
          })
        ) || [
          {
            '@type': 'HowToStep',
            position: 1,
            name: locale === 'zh' ? '上传音频文件' : 'Upload Audio File',
            text:
              locale === 'zh'
                ? '点击上传按钮，选择您的音频或视频文件，支持多种格式'
                : 'Click upload button and select your audio or video file, supports multiple formats',
            image: `${siteUrl}/steps/step-1-upload.png`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name:
              locale === 'zh' ? '选择处理选项' : 'Choose Processing Options',
            text:
              locale === 'zh'
                ? '选择转录语言、输出格式和其他个性化设置'
                : 'Select transcription language, output format and other personalization settings',
            image: `${siteUrl}/steps/step-2-options.png`,
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: locale === 'zh' ? 'AI处理生成' : 'AI Processing',
            text:
              locale === 'zh'
                ? 'AI系统自动分析音频内容，生成结构化的节目笔记'
                : 'AI system automatically analyzes audio content and generates structured show notes',
            image: `${siteUrl}/steps/step-3-processing.png`,
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: locale === 'zh' ? '下载结果' : 'Download Results',
            text:
              locale === 'zh'
                ? '预览并下载生成的节目笔记，支持多种导出格式'
                : 'Preview and download generated show notes in various export formats',
            image: `${siteUrl}/steps/step-4-download.png`,
          },
        ],
      }

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (data as FAQPageData)?.faqs?.map((faq: FAQData) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [
          {
            '@type': 'Question',
            name:
              locale === 'zh'
                ? 'AutoShow支持哪些音频格式？'
                : 'What audio formats does AutoShow support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                locale === 'zh'
                  ? 'AutoShow支持MP3、WAV、M4A、MP4、MOV、AVI等多种常见音视频格式，文件大小最大支持500MB。'
                  : 'AutoShow supports common audio/video formats including MP3, WAV, M4A, MP4, MOV, AVI with maximum file size of 500MB.',
            },
          },
          {
            '@type': 'Question',
            name:
              locale === 'zh'
                ? '处理一个音频文件需要多长时间？'
                : 'How long does it take to process an audio file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                locale === 'zh'
                  ? '处理时间取决于文件长度和复杂度，通常是音频长度的10-20%。例如60分钟的音频大约需要6-12分钟处理。'
                  : 'Processing time depends on file length and complexity, typically 10-20% of audio duration. For example, a 60-minute audio takes about 6-12 minutes to process.',
            },
          },
          {
            '@type': 'Question',
            name:
              locale === 'zh'
                ? 'AutoShow是免费的吗？'
                : 'Is AutoShow free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                locale === 'zh'
                  ? 'AutoShow提供免费版本，支持基础功能和有限的使用量。高级功能和更大使用量需要升级到付费计划。'
                  : 'AutoShow offers a free tier with basic features and limited usage. Advanced features and higher usage limits require upgrading to paid plans.',
            },
          },
        ],
      }

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'SoftwareCompany'],
        name: 'AutoShow',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
          width: 200,
          height: 200,
        },
        description:
          locale === 'zh'
            ? 'AutoShow是一个AI驱动的音视频内容处理平台，帮助内容创作者、播客主和企业快速生成专业的节目笔记'
            : 'AutoShow is an AI-powered audio and video content processing platform that helps content creators, podcasters, and businesses quickly generate professional show notes',

        // 联系信息
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-XXX-XXX-XXXX',
          contactType: 'customer service',
          availableLanguage: ['English', 'Chinese'],
        },

        // 社交媒体
        sameAs: [
          'https://github.com/autoshow-project',
          'https://twitter.com/autoshow',
          'https://linkedin.com/company/autoshow',
        ],

        // 创立信息
        foundingDate: '2024',
        foundingLocation: 'United States',

        // 服务区域
        areaServed: 'Worldwide',

        // 业务类型
        industry: 'Artificial Intelligence',
        numberOfEmployees: '10-50',
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: (data as ArticleData)?.title,
        description: (data as ArticleData)?.description,
        author: {
          '@type': 'Organization',
          name: 'AutoShow',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'AutoShow',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
            width: 200,
            height: 200,
          },
        },
        datePublished:
          (data as ArticleData)?.publishedAt || new Date().toISOString(),
        dateModified:
          (data as ArticleData)?.updatedAt || new Date().toISOString(),
        image:
          (data as ArticleData)?.image || `${siteUrl}/og/${locale}/article.png`,
        articleSection: (data as ArticleData)?.category || 'Show Notes',
        keywords: (data as ArticleData)?.keywords || [
          'AI',
          'transcription',
          'show notes',
          'audio processing',
        ],
        wordCount: (data as ArticleData)?.wordCount || 1000,
        inLanguage: locale,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': (data as ArticleData)?.url || `${siteUrl}/${locale}`,
        },
      }

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement:
          (data as BreadcrumbListData)?.breadcrumbs?.map(
            (item: BreadcrumbData, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })
          ) || [],
      }

    default:
      return {}
  }
}

// 安全的JSON-LD序列化（防止XSS）
export function safeJsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

// 验证结构化数据
export function validateStructuredData(schema: object): boolean {
  try {
    const required = ['@context', '@type']
    return required.every(field => field in schema)
  } catch {
    return false
  }
}
