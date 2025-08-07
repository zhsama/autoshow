import type { DocumentComponent, DocumentPageMeta } from 'storybook/typings'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  AudioPlayerCard,
  AudioFileCard,
  TranscriptCard,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Download,
  Share,
  Clock,
  FileAudio,
  Users,
  TrendingUp,
  Star,
  Music,
} from 'lucide-react'

// Basic Card Variants
export const CardVariantsDemo: DocumentComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card variant="default">
        <CardHeader>
          <CardTitle>默认卡片</CardTitle>
          <CardDescription>基础卡片样式，带有轻微阴影</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            这是一个默认卡片的内容区域。适用于大多数使用场景。
          </p>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>提升卡片</CardTitle>
          <CardDescription>更明显的阴影效果，突出重要性</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            提升卡片适用于需要强调的内容，具有更强的视觉层次。
          </p>
        </CardContent>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle>边框卡片</CardTitle>
          <CardDescription>仅显示边框，无背景色差异</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            边框卡片更加轻量，适用于密集的信息展示。
          </p>
        </CardContent>
      </Card>

      <Card variant="ghost">
        <CardHeader>
          <CardTitle>幽灵卡片</CardTitle>
          <CardDescription>透明背景，无边框和阴影</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            幽灵卡片几乎透明，适用于极简设计风格。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

CardVariantsDemo.meta = {
  title: '卡片变体',
  description: '展示不同样式的卡片变体，包括默认、提升、边框和幽灵样式',
}

// Card Sizes
export const CardSizesDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4">
      <Card size="sm">
        <CardHeader size="sm">
          <CardTitle size="sm">小尺寸卡片</CardTitle>
          <CardDescription size="sm">
            紧凑的内边距，适用于信息密集的场景
          </CardDescription>
        </CardHeader>
        <CardContent size="sm">
          <p className="text-xs">小尺寸内容区域</p>
        </CardContent>
      </Card>

      <Card size="default">
        <CardHeader>
          <CardTitle>默认尺寸卡片</CardTitle>
          <CardDescription>
            标准的内边距，平衡了内容和视觉舒适度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">标准尺寸内容区域</p>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader size="lg">
          <CardTitle size="lg">大尺寸卡片</CardTitle>
          <CardDescription size="lg">
            更宽松的内边距，适用于重要内容展示
          </CardDescription>
        </CardHeader>
        <CardContent size="lg">
          <p>大尺寸内容区域，有更多的留白空间</p>
        </CardContent>
      </Card>
    </div>
  )
}

CardSizesDemo.meta = {
  title: '卡片尺寸',
  description: '展示不同尺寸的卡片，包括小、默认和大尺寸',
}

// Rounded Variants
export const RoundedCardsDemo: DocumentComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card rounded="sm">
        <CardHeader>
          <CardTitle size="sm">小圆角</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">rounded-sm</p>
        </CardContent>
      </Card>

      <Card rounded="lg">
        <CardHeader>
          <CardTitle size="sm">大圆角</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">rounded-lg (默认)</p>
        </CardContent>
      </Card>

      <Card rounded="2xl">
        <CardHeader>
          <CardTitle size="sm">超大圆角</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">rounded-2xl</p>
        </CardContent>
      </Card>
    </div>
  )
}

RoundedCardsDemo.meta = {
  title: '圆角变体',
  description: '展示不同圆角程度的卡片样式',
}

// Interactive Cards
export const InteractiveCardsDemo: DocumentComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card clickable onClick={() => alert('点击了可点击卡片！')}>
        <CardHeader>
          <CardTitle>可点击卡片</CardTitle>
          <CardDescription>具有交互效果的卡片</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            鼠标悬停时显示特殊效果，点击时有缩放动画
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm">
            了解更多
          </Button>
        </CardFooter>
      </Card>

      <Card variant="interactive" onClick={() => alert('点击了交互卡片！')}>
        <CardHeader>
          <CardTitle>交互卡片</CardTitle>
          <CardDescription>使用 interactive 变体</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            专门的交互变体，具有悬停边框变化效果
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            查看详情
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

InteractiveCardsDemo.meta = {
  title: '交互卡片',
  description: '展示具有点击和悬停交互效果的卡片',
}

// Loading State
export const LoadingCardDemo: DocumentComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>正常状态卡片</CardTitle>
          <CardDescription>完全加载的卡片内容</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            这是一个正常加载完成的卡片，显示实际内容。
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">操作按钮</Button>
        </CardFooter>
      </Card>

      <Card loading>
        <CardHeader>
          <CardTitle>加载中的卡片</CardTitle>
          <CardDescription>内容正在加载中...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            这些内容不会显示，取而代之的是加载骨架屏
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

LoadingCardDemo.meta = {
  title: '加载状态',
  description: '展示卡片的加载状态，显示骨架屏动画',
}

// Audio Player Cards
export const AudioPlayerCardsDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4">
      <AudioPlayerCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>音频播放器</CardTitle>
              <CardDescription>专用于音频播放的卡片样式</CardDescription>
            </div>
            <Button size="icon" variant="ghost">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={33} className="w-full" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>1:23</span>
              <span>3:45</span>
            </div>
          </div>
        </CardContent>
      </AudioPlayerCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AudioFileCard
          duration="3:45"
          fileSize="5.2 MB"
          status="completed"
          onClick={() => alert('播放音频文件')}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileAudio className="h-8 w-8 text-primary" />
              <div>
                <CardTitle size="sm">podcast_episode_01.mp3</CardTitle>
                <CardDescription>处理完成的音频文件</CardDescription>
              </div>
            </div>
          </CardHeader>
        </AudioFileCard>

        <AudioFileCard duration="--:--" fileSize="8.1 MB" status="processing">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileAudio className="h-8 w-8 text-muted-foreground" />
              <div>
                <CardTitle size="sm">interview_session.wav</CardTitle>
                <CardDescription>正在处理中...</CardDescription>
              </div>
            </div>
          </CardHeader>
        </AudioFileCard>
      </div>
    </div>
  )
}

AudioPlayerCardsDemo.meta = {
  title: '音频专用卡片',
  description: '展示专门为音频播放和文件管理设计的卡片组件',
}

// Transcript Cards
export const TranscriptCardsDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4">
      <TranscriptCard
        timestamp="00:00:15"
        confidence={0.95}
        speaker="主持人"
        onClick={() => alert('跳转到时间点')}
      >
        欢迎大家收听本期播客，今天我们将讨论人工智能在音频处理中的应用。
      </TranscriptCard>

      <TranscriptCard
        timestamp="00:01:22"
        confidence={0.87}
        speaker="嘉宾"
        onClick={() => alert('跳转到时间点')}
      >
        这是一个非常有趣的话题。随着技术的发展，我们看到越来越多的创新应用。
      </TranscriptCard>

      <TranscriptCard
        timestamp="00:02:05"
        confidence={0.62}
        speaker="主持人"
        onClick={() => alert('跳转到时间点')}
      >
        [这段内容的识别置信度较低，可能存在错误]
      </TranscriptCard>
    </div>
  )
}

TranscriptCardsDemo.meta = {
  title: '转录卡片',
  description:
    '展示用于显示音频转录内容的专用卡片，包含时间戳、说话人和置信度信息',
}

// Complex Card Example
export const ComplexCardDemo: DocumentComponent = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card
        variant="elevated"
        clickable
        onClick={() => alert('查看播客详情！')}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>科技前沿播客</CardTitle>
                <CardDescription>第42期 - AI音频处理</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">新发布</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              本期节目深入探讨了人工智能在音频处理领域的最新发展，包括语音识别、音频合成和智能降噪等技术。
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>45分钟</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>1.2k 收听</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>4.8</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                AI
              </Badge>
              <Badge variant="outline" className="text-xs">
                音频
              </Badge>
              <Badge variant="outline" className="text-xs">
                技术
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Play className="h-4 w-4 mr-1" />
              播放
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              下载
            </Button>
          </div>
          <Button size="sm" variant="ghost">
            <Share className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

ComplexCardDemo.meta = {
  title: '复合卡片示例',
  description:
    '展示一个包含多种元素的复杂卡片：头像、标题、描述、统计信息、标签和操作按钮',
}

// Stats Cards
export const StatsCardsDemo: DocumentComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle size="sm">总收听量</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24,571</div>
          <p className="text-xs text-muted-foreground">比上月增长 +12.5%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle size="sm">活跃用户</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,847</div>
          <p className="text-xs text-muted-foreground">比上月增长 +8.2%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle size="sm">处理时长</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156h</div>
          <p className="text-xs text-muted-foreground">本月音频处理总时长</p>
        </CardContent>
      </Card>
    </div>
  )
}

StatsCardsDemo.meta = {
  title: '统计卡片',
  description: '展示用于数据统计展示的卡片布局，包含数值、图标和趋势信息',
}

export const metadata: DocumentPageMeta = {
  title: 'Card 卡片组件',
  description:
    'AutoShow 卡片组件提供了丰富的变体和专用样式，支持音频播放器、文件管理、转录显示等特殊用途。',
  category: 'ui',
}
