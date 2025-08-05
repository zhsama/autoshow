import { Folder, Plus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generatePageMetadata } from '@/lib/seo/metadata'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return generatePageMetadata({ locale, page: 'collections' })
}

export default function CollectionsPage() {
  // Mock data - in real app, this would come from your API
  const collections = [
    {
      id: 1,
      name: 'Frontend Development',
      description: 'React, Vue, and modern web development content',
      itemCount: 23,
      lastUpdated: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      name: 'System Design',
      description: 'Architecture patterns and design principles',
      itemCount: 15,
      lastUpdated: new Date(Date.now() - 86400000).toLocaleDateString(),
    },
    {
      id: 3,
      name: 'Podcasts',
      description: 'Tech podcasts and interviews',
      itemCount: 42,
      lastUpdated: new Date(Date.now() - 172800000).toLocaleDateString(),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Collections
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Organize your media into collections
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map(collection => (
          <Card
            key={collection.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <Folder className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  {collection.itemCount} items
                </span>
              </div>
              <CardTitle className="mt-4 text-base md:text-lg">
                {collection.name}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {collection.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <p className="text-xs text-muted-foreground">
                Last updated: {collection.lastUpdated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
