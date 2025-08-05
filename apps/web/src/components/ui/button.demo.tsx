import type { DocumentComponent, DocumentPageMeta } from 'storybook/typings'
import {
  Button,
  AudioPlayButton,
  AudioPauseButton,
  AudioLoadingButton,
} from '@/components/ui/button'
import {
  Play,
  Pause,
  Loader2,
  Download,
  Upload,
  Settings,
  Heart,
  Star,
  Trash2,
  Plus,
  Search,
} from 'lucide-react'

// Basic Button Variants
export const ButtonVariantsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button variant="default">默认按钮</Button>
      <Button variant="destructive">危险按钮</Button>
      <Button variant="outline">边框按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="link">链接按钮</Button>
    </div>
  )
}

ButtonVariantsDemo.meta = {
  title: '按钮变体',
  description: '展示所有基础按钮变体样式',
}

// Enhanced Button Variants
export const EnhancedVariantsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button variant="success">成功按钮</Button>
      <Button variant="warning">警告按钮</Button>
      <Button variant="info">信息按钮</Button>
    </div>
  )
}

EnhancedVariantsDemo.meta = {
  title: '增强变体',
  description: '展示成功、警告、信息等增强按钮变体',
}

// Button Sizes
export const ButtonSizesDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button size="sm">小按钮</Button>
      <Button size="default">默认按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="xl">超大按钮</Button>
    </div>
  )
}

ButtonSizesDemo.meta = {
  title: '按钮尺寸',
  description: '展示不同尺寸的按钮样式',
}

// Icon Buttons
export const IconButtonsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Button size="icon" variant="outline">
        <Settings className="h-4 w-4" />
      </Button>
      <Button size="icon-sm" variant="ghost">
        <Heart className="h-3 w-3" />
      </Button>
      <Button size="icon-lg" variant="default">
        <Star className="h-5 w-5" />
      </Button>
      <Button size="icon-xl" variant="destructive">
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  )
}

IconButtonsDemo.meta = {
  title: '图标按钮',
  description: '展示不同尺寸的图标按钮',
}

// Buttons with Icons and Text
export const ButtonsWithIconsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        新建
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        下载
      </Button>
      <Button variant="secondary">
        <Upload className="mr-2 h-4 w-4" />
        上传
      </Button>
      <Button variant="ghost">
        <Search className="mr-2 h-4 w-4" />
        搜索
      </Button>
    </div>
  )
}

ButtonsWithIconsDemo.meta = {
  title: '图标文字按钮',
  description: '展示包含图标和文字的按钮组合',
}

// Loading States
export const LoadingButtonsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button loading>加载中...</Button>
      <Button loading variant="outline" loadingText="处理中">
        处理
      </Button>
      <Button loading variant="destructive">
        删除
      </Button>
      <Button loading size="sm">
        保存
      </Button>
    </div>
  )
}

LoadingButtonsDemo.meta = {
  title: '加载状态按钮',
  description: '展示带有加载状态的按钮，包含加载动画和文字',
}

// Disabled States
export const DisabledButtonsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button disabled>禁用按钮</Button>
      <Button disabled variant="outline">
        禁用边框
      </Button>
      <Button disabled variant="destructive">
        禁用危险
      </Button>
      <Button disabled variant="ghost">
        禁用幽灵
      </Button>
    </div>
  )
}

DisabledButtonsDemo.meta = {
  title: '禁用状态',
  description: '展示各种变体的禁用状态按钮',
}

// Rounded Variants
export const RoundedButtonsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button rounded="sm">小圆角</Button>
      <Button rounded="md">中圆角</Button>
      <Button rounded="lg">大圆角</Button>
      <Button rounded="xl">超大圆角</Button>
      <Button rounded="full">完全圆角</Button>
    </div>
  )
}

RoundedButtonsDemo.meta = {
  title: '圆角变体',
  description: '展示不同圆角程度的按钮样式',
}

// Audio Control Buttons
export const AudioControlsDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <div className="text-center">
        <AudioPlayButton>
          <Play className="h-6 w-6" />
        </AudioPlayButton>
        <p className="mt-2 text-sm text-slate-500">播放按钮</p>
      </div>

      <div className="text-center">
        <AudioPauseButton>
          <Pause className="h-6 w-6" />
        </AudioPauseButton>
        <p className="mt-2 text-sm text-slate-500">暂停按钮</p>
      </div>

      <div className="text-center">
        <AudioLoadingButton>
          <Loader2 className="h-6 w-6 animate-spin" />
        </AudioLoadingButton>
        <p className="mt-2 text-sm text-slate-500">加载按钮</p>
      </div>
    </div>
  )
}

AudioControlsDemo.meta = {
  title: '音频控制按钮',
  description: '展示专门用于音频控制的特殊按钮组件',
}

// Audio Button Sizes
export const AudioButtonSizesDemo: DocumentComponent = () => {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <div className="text-center">
        <Button variant="audio-play" size="audio-mini" rounded="full">
          <Play className="h-3 w-3" />
        </Button>
        <p className="mt-2 text-sm text-slate-500">迷你</p>
      </div>

      <div className="text-center">
        <Button variant="audio-play" size="audio-control" rounded="full">
          <Play className="h-6 w-6" />
        </Button>
        <p className="mt-2 text-sm text-slate-500">标准</p>
      </div>

      <div className="text-center">
        <Button variant="audio-play" size="audio-large" rounded="full">
          <Play className="h-8 w-8" />
        </Button>
        <p className="mt-2 text-sm text-slate-500">大尺寸</p>
      </div>
    </div>
  )
}

AudioButtonSizesDemo.meta = {
  title: '音频按钮尺寸',
  description: '展示不同尺寸的音频控制按钮',
}

// Interactive Demo
export const InteractiveButtonDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h3 className="mb-4 text-lg font-semibold">交互效果展示</h3>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          点击下方按钮体验缩放和悬停效果
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Button variant="default" onClick={() => alert('点击了默认按钮！')}>
          默认效果
        </Button>
        <Button variant="outline" onClick={() => alert('点击了边框按钮！')}>
          边框效果
        </Button>
        <Button variant="destructive" onClick={() => alert('点击了危险按钮！')}>
          危险效果
        </Button>
        <Button variant="success" onClick={() => alert('点击了成功按钮！')}>
          成功效果
        </Button>
      </div>
    </div>
  )
}

InteractiveButtonDemo.meta = {
  title: '交互效果',
  description: '展示按钮的点击、悬停和缩放等交互效果',
}

export const metadata: DocumentPageMeta = {
  title: 'Button 按钮组件',
  description:
    'AutoShow 按钮组件提供了丰富的变体、尺寸和状态，支持加载状态、音频控制等特殊功能。',
  category: 'ui',
}
