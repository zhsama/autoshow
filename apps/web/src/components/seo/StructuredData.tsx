import {
  generateStructuredData,
  safeJsonLd,
  type StructuredDataOptions,
} from '@/lib/seo/structured-data'

export function StructuredData(props: StructuredDataOptions) {
  const schema = generateStructuredData(props)

  if (!schema || Object.keys(schema).length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(schema),
      }}
    />
  )
}
