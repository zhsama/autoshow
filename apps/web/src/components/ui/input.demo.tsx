import type { DocumentComponent, DocumentPageMeta } from 'storybook/typings'
import {
  Input,
  AudioTimeInput,
  VolumeInput,
  ProgressInput,
  FormGroup,
} from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  Settings,
  Volume2,
  Clock,
} from 'lucide-react'
import { useState } from 'react'

// Basic Input Variants
export const InputVariantsDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <Input variant="default" placeholder="默认输入框" />
      <Input variant="success" placeholder="成功状态输入框" />
      <Input variant="warning" placeholder="警告状态输入框" />
      <Input variant="error" placeholder="错误状态输入框" />
      <Input variant="ghost" placeholder="幽灵输入框" />
    </div>
  )
}

InputVariantsDemo.meta = {
  title: '输入框变体',
  description: '展示不同状态的输入框变体，包括默认、成功、警告、错误和幽灵样式',
}

// Input Sizes
export const InputSizesDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <Input size="sm" placeholder="小尺寸输入框" />
      <Input size="default" placeholder="默认尺寸输入框" />
      <Input size="lg" placeholder="大尺寸输入框" />
      <Input size="xl" placeholder="超大尺寸输入框" />
    </div>
  )
}

InputSizesDemo.meta = {
  title: '输入框尺寸',
  description: '展示不同尺寸的输入框：小、默认、大和超大尺寸',
}

// Rounded Variants
export const RoundedInputsDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <Input rounded="sm" placeholder="小圆角" />
      <Input rounded="default" placeholder="默认圆角" />
      <Input rounded="lg" placeholder="大圆角" />
      <Input rounded="xl" placeholder="超大圆角" />
      <Input rounded="full" placeholder="完全圆角" />
    </div>
  )
}

RoundedInputsDemo.meta = {
  title: '圆角变体',
  description: '展示不同圆角程度的输入框样式',
}

// Input with Icons
export const InputWithIconsDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <Input leftIcon={<Search />} placeholder="搜索..." />
      <Input leftIcon={<User />} placeholder="用户名" />
      <Input leftIcon={<Mail />} placeholder="电子邮箱" type="email" />
      <Input leftIcon={<Lock />} placeholder="密码" type="password" />
      <Input
        leftIcon={<Phone />}
        rightIcon={<Settings />}
        placeholder="电话号码"
      />
    </div>
  )
}

InputWithIconsDemo.meta = {
  title: '带图标的输入框',
  description: '展示在输入框左侧或右侧添加图标的样式',
}

// Input States
export const InputStatesDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4 max-w-md">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">正常状态</h3>
        <Input placeholder="请输入内容" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">成功状态</h3>
        <Input
          success="输入格式正确"
          placeholder="输入验证成功"
          defaultValue="valid@example.com"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">错误状态</h3>
        <Input
          error="请输入有效的邮箱地址"
          placeholder="错误状态示例"
          defaultValue="invalid-email"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">禁用状态</h3>
        <Input disabled placeholder="禁用的输入框" defaultValue="不可编辑" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">加载状态</h3>
        <Input loading placeholder="加载中..." leftIcon={<User />} />
      </div>
    </div>
  )
}

InputStatesDemo.meta = {
  title: '输入框状态',
  description: '展示输入框的各种状态：正常、成功、错误、禁用和加载状态',
}

// Helper Text Examples
export const HelperTextDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4 max-w-md">
      <Input
        placeholder="用户名"
        helperText="用户名长度应为 3-20 个字符"
        leftIcon={<User />}
      />

      <Input
        type="password"
        placeholder="密码"
        helperText="密码应包含至少 8 个字符，包含字母和数字"
        leftIcon={<Lock />}
      />

      <Input
        type="email"
        placeholder="邮箱地址"
        success="邮箱格式正确"
        defaultValue="user@example.com"
        leftIcon={<Mail />}
      />

      <Input
        placeholder="电话号码"
        error="请输入有效的电话号码"
        defaultValue="123"
        leftIcon={<Phone />}
      />
    </div>
  )
}

HelperTextDemo.meta = {
  title: '辅助文本',
  description: '展示输入框的辅助文本、成功提示和错误信息',
}

// Form Group Examples
export const FormGroupDemo: DocumentComponent = () => {
  return (
    <div className="space-y-6 p-4 max-w-md">
      <FormGroup label="用户名" required helperText="请输入您的用户名">
        <Input placeholder="请输入用户名" leftIcon={<User />} />
      </FormGroup>

      <FormGroup label="邮箱地址" required success="邮箱格式正确">
        <Input
          type="email"
          placeholder="请输入邮箱地址"
          leftIcon={<Mail />}
          defaultValue="user@example.com"
        />
      </FormGroup>

      <FormGroup label="电话号码" error="请输入有效的电话号码">
        <Input
          placeholder="请输入电话号码"
          leftIcon={<Phone />}
          defaultValue="123"
        />
      </FormGroup>

      <FormGroup label="地址" size="sm" helperText="可选填写">
        <Input placeholder="请输入地址" leftIcon={<MapPin />} size="sm" />
      </FormGroup>
    </div>
  )
}

FormGroupDemo.meta = {
  title: '表单组合',
  description: '展示带有标签、必填标识和辅助信息的完整表单组合',
}

// Password Input with Toggle
export const PasswordToggleDemo: DocumentComponent = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-4 p-4 max-w-md">
      <FormGroup label="密码" required helperText="密码长度应为 8-20 个字符">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="请输入密码"
          leftIcon={<Lock />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />
      </FormGroup>

      <FormGroup label="确认密码" required>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="请再次输入密码"
          leftIcon={<Lock />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />
      </FormGroup>
    </div>
  )
}

PasswordToggleDemo.meta = {
  title: '密码切换显示',
  description: '展示可以切换显示/隐藏的密码输入框',
}

// Different Input Types
export const InputTypesDemo: DocumentComponent = () => {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <Input type="text" placeholder="文本输入" leftIcon={<FileText />} />
      <Input type="email" placeholder="邮箱输入" leftIcon={<Mail />} />
      <Input type="password" placeholder="密码输入" leftIcon={<Lock />} />
      <Input type="tel" placeholder="电话输入" leftIcon={<Phone />} />
      <Input type="url" placeholder="网址输入" defaultValue="https://" />
      <Input type="date" leftIcon={<Calendar />} />
      <Input type="number" placeholder="数字输入" leftIcon={<DollarSign />} />
      <Input type="search" placeholder="搜索输入" leftIcon={<Search />} />
    </div>
  )
}

InputTypesDemo.meta = {
  title: '不同输入类型',
  description:
    '展示各种 HTML 输入类型：文本、邮箱、密码、电话、网址、日期、数字、搜索',
}

// Audio-specific Inputs
export const AudioInputsDemo: DocumentComponent = () => {
  const [volume, setVolume] = useState(50)
  const [progress, setProgress] = useState(30)

  return (
    <div className="space-y-6 p-4 max-w-md">
      <FormGroup label="时间码输入" helperText="格式: HH:MM:SS">
        <AudioTimeInput placeholder="00:00:00" leftIcon={<Clock />} />
      </FormGroup>

      <FormGroup label="音量控制" helperText={`当前音量: ${volume}%`}>
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <VolumeInput
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono w-10">{volume}</span>
        </div>
      </FormGroup>

      <FormGroup label="播放进度" helperText={`进度: ${progress}%`}>
        <ProgressInput
          value={progress}
          onChange={e => setProgress(Number(e.target.value))}
          max={100}
        />
      </FormGroup>

      <FormGroup label="跳转到时间点" helperText="输入时间戳快速跳转">
        <div className="flex gap-2">
          <AudioTimeInput placeholder="00:05:30" size="sm" />
          <Button size="sm">跳转</Button>
        </div>
      </FormGroup>
    </div>
  )
}

AudioInputsDemo.meta = {
  title: '音频专用输入',
  description: '展示专门用于音频应用的输入组件：时间码、音量控制、播放进度等',
}

// Interactive Form Example
export const InteractiveFormDemo: DocumentComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert('表单提交成功！\n' + JSON.stringify(formData, null, 2))
    }
  }

  return (
    <div className="p-4 max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup label="姓名" required error={errors.name}>
          <Input
            placeholder="请输入您的姓名"
            leftIcon={<User />}
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            error={errors.name}
          />
        </FormGroup>

        <FormGroup label="邮箱地址" required error={errors.email}>
          <Input
            type="email"
            placeholder="请输入邮箱地址"
            leftIcon={<Mail />}
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            error={errors.email}
          />
        </FormGroup>

        <FormGroup
          label="留言内容"
          required
          error={errors.message}
          helperText="请详细描述您的需求"
        >
          <Input
            placeholder="请输入留言内容"
            leftIcon={<FileText />}
            value={formData.message}
            onChange={e =>
              setFormData(prev => ({ ...prev, message: e.target.value }))
            }
            error={errors.message}
          />
        </FormGroup>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            提交表单
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({ name: '', email: '', message: '' })
              setErrors({})
            }}
          >
            重置
          </Button>
        </div>
      </form>
    </div>
  )
}

InteractiveFormDemo.meta = {
  title: '交互式表单',
  description: '展示完整的表单交互，包含实时验证、错误处理和数据提交',
}

export const metadata: DocumentPageMeta = {
  title: 'Input 输入框组件',
  description:
    'AutoShow 输入框组件提供了丰富的变体、状态和专用类型，支持图标、验证状态、音频时间输入等特殊功能。',
  category: 'ui',
}
