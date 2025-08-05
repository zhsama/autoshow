import { Clock, Download, Calendar } from 'lucide-react'
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
  return generatePageMetadata({ locale, page: 'history' })
}

export default function HistoryPage() {
  // Mock data - in real app, this would come from your API
  const historyItems = [
    {
      id: 1,
      title: 'React 18 Deep Dive',
      type: 'youtube',
      date: new Date().toLocaleDateString(),
      duration: '45:32',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Frontend Architecture Podcast',
      type: 'podcast',
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      duration: '1:23:45',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Design Systems Conference',
      type: 'video',
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
      duration: '2:15:00',
      status: 'processing',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          History
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          View and manage your imported media content
        </p>
      </div>

      <div className="grid gap-4">
        {historyItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 md:p-6 pb-4 md:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base md:text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs md:text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {item.type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
