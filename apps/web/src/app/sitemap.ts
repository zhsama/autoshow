import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoshow.ai'
  const locales = ['en', 'zh']

  // 静态页面
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: 'collections', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'history', priority: 0.6, changeFrequency: 'weekly' as const },
  ]

  const routes: MetadataRoute.Sitemap = []

  // 为每种语言生成静态页面
  locales.forEach(locale => {
    staticPages.forEach(page => {
      const url = page.path
        ? `${siteUrl}/${locale}/${page.path}`
        : `${siteUrl}/${locale}`

      routes.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        // hreflang替代链接
        alternates: {
          languages: locales.reduce(
            (acc, l) => ({
              ...acc,
              [l]: page.path
                ? `${siteUrl}/${l}/${page.path}`
                : `${siteUrl}/${l}`,
            }),
            {}
          ),
        },
      })
    })
  })

  // TODO: 动态Show Notes页面
  // 在实际实施中，这里应该从数据库或API获取所有show notes
  // 目前先添加示例结构
  const sampleShowNotes = [
    { id: 'sample-1', lastModified: new Date(), priority: 0.7 },
    { id: 'sample-2', lastModified: new Date(), priority: 0.7 },
  ]

  locales.forEach(locale => {
    sampleShowNotes.forEach(note => {
      routes.push({
        url: `${siteUrl}/${locale}/show-notes/${note.id}`,
        lastModified: note.lastModified,
        changeFrequency: 'monthly',
        priority: note.priority,
        alternates: {
          languages: locales.reduce(
            (acc, l) => ({
              ...acc,
              [l]: `${siteUrl}/${l}/show-notes/${note.id}`,
            }),
            {}
          ),
        },
      })
    })
  })

  return routes
}

// 辅助函数：获取Show Notes数据（将来实现）
async function _getShowNotesForSitemap() {
  // TODO: 实现从数据库或API获取show notes
  // const showNotes = await fetch('/api/show-notes').then(res => res.json())
  // return showNotes.map(note => ({
  //   id: note.id,
  //   lastModified: new Date(note.updatedAt),
  //   priority: 0.7
  // }))

  return []
}
