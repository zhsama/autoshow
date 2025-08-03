# Autoshow 设计系统架构方案

## 项目概述

Autoshow是一个音频转录和播客处理平台，需要一个专门适配音频/媒体领域的设计系统。基于对Shiro项目的深入学习和autoshow当前技术栈分析，设计了这套渐进式、模块化的设计系统架构。

## 技术基础评估

### 当前优势

- ✅ **Next.js 15.4.3 + React 19** - 最新技术栈
- ✅ **Tailwind CSS v4** - 最新CSS框架，支持@theme语法
- ✅ **完整Radix UI生态** - 可访问性组件基础
- ✅ **Class Variance Authority** - 组件变体管理
- ✅ **基础主题系统** - next-themes支持

### 需要优化的领域

- 🔧 **颜色系统** - 需要更丰富的语义化色板
- 🔧 **组件架构** - 需要层次化的组件体系
- 🔧 **动画系统** - 缺乏流畅的交互动画
- 🔧 **响应式系统** - 需要更精细的断点管理
- 🔧 **音频专用组件** - 播放器、波形、时间轴等

## 设计系统架构

### 1. 颜色系统 (Color System)

#### 语义化颜色架构

```css
/* 基础色板 - 适配音频/媒体品牌 */
--color-brand-50: #f0f9ff; /* 品牌色最浅 */
--color-brand-500: #3b82f6; /* 主品牌色 */
--color-brand-900: #1e3a8a; /* 品牌色最深 */

/* 功能色板 - 音频状态指示 */
--color-audio-playing: #10b981; /* 播放状态 */
--color-audio-paused: #f59e0b; /* 暂停状态 */
--color-audio-loading: #6366f1; /* 加载状态 */
--color-audio-error: #ef4444; /* 错误状态 */

/* 语义化系统色 */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

#### 自适应主题系统

- **Light Mode**: 高对比度，适合专业音频编辑
- **Dark Mode**: 护眼深色，适合长时间音频处理
- **High Contrast**: 无障碍访问支持

### 2. 组件层次架构

```
src/components/
├── ui/                     # 基础UI原子组件
│   ├── button/            # 按钮组件族
│   ├── input/             # 输入组件族
│   ├── card/              # 卡片组件族
│   ├── badge/             # 徽章组件族
│   └── ...
├── audio/                  # 音频专用组件
│   ├── player/            # 音频播放器
│   ├── waveform/          # 波形显示
│   ├── timeline/          # 时间轴控制
│   ├── volume/            # 音量控制
│   └── transcript/        # 转录显示
├── layout/                # 布局组件
│   ├── header/            # 页头
│   ├── sidebar/           # 侧边栏
│   ├── main/              # 主内容区
│   └── footer/            # 页脚
├── modules/               # 功能模块组件
│   ├── upload/            # 文件上传模块
│   ├── library/           # 音频库模块
│   ├── editor/            # 编辑器模块
│   └── dashboard/         # 仪表板模块
└── common/                # 通用组件
    ├── loading/           # 加载状态
    ├── error/             # 错误处理
    └── empty/             # 空状态
```

### 3. 设计Token系统

#### 间距系统 (Spacing)

```css
/* 基于8px基准的间距系统 */
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
--space-3xl: 4rem; /* 64px */
```

#### 字体系统 (Typography)

```css
/* 音频应用专用字体堆栈 */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
--font-brand: 'Inter', var(--font-sans);

/* 字体大小层次 */
--text-xs: 0.75rem; /* 12px - 时间戳 */
--text-sm: 0.875rem; /* 14px - 辅助信息 */
--text-base: 1rem; /* 16px - 正文 */
--text-lg: 1.125rem; /* 18px - 标题 */
--text-xl: 1.25rem; /* 20px - 大标题 */
--text-2xl: 1.5rem; /* 24px - 页面标题 */
```

#### 阴影系统 (Elevation)

```css
/* 层次感阴影 - 适配深浅主题 */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

/* 音频组件专用阴影 */
--shadow-player: 0 8px 32px rgba(59, 130, 246, 0.15);
--shadow-modal: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### 4. 动画系统

#### 基础动画原语

```css
/* 基础缓动函数 */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 音频专用缓动 */
--ease-audio: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 时长设置 */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

#### 交互动画模式

- **Micro-interactions**: 按钮悬停、状态切换
- **Page Transitions**: 路由切换、模态框
- **Audio Feedback**: 播放状态、波形动画
- **Loading States**: 上传进度、处理状态

### 5. 响应式架构

#### 断点系统

```css
/* 移动优先的响应式断点 */
--breakpoint-sm: 640px; /* 小屏手机 */
--breakpoint-md: 768px; /* 平板竖屏 */
--breakpoint-lg: 1024px; /* 平板横屏/小笔记本 */
--breakpoint-xl: 1280px; /* 桌面 */
--breakpoint-2xl: 1536px; /* 大屏桌面 */
```

#### 布局模式

- **Mobile**: 单列布局，底部播放控制
- **Tablet**: 两列布局，侧边播放控制
- **Desktop**: 三列布局，独立播放器面板

### 6. 音频专用设计规范

#### 音频状态视觉语言

```css
/* 播放状态指示器 */
.audio-playing {
  --indicator-color: var(--color-audio-playing);
  --pulse-animation: audio-pulse 2s infinite;
}

.audio-paused {
  --indicator-color: var(--color-audio-paused);
}

.audio-loading {
  --indicator-color: var(--color-audio-loading);
  --spin-animation: spin 1s linear infinite;
}
```

#### 音频交互原则

- **时间显示**: 使用等宽字体，保证数字对齐
- **进度指示**: 清晰的视觉反馈和精确控制
- **波形显示**: 高对比度，支持缩放和选择
- **快捷键支持**: 空格键播放/暂停，方向键快进/快退

### 7. 可访问性 (A11y) 规范

#### 音频可访问性

- **屏幕阅读器支持**: ARIA标签和语义化HTML
- **键盘导航**: Tab顺序和快捷键
- **视觉指示**: 高对比度模式支持
- **转录文本**: 结构化的音频内容展示

#### 颜色对比度

- **正常文本**: 最低4.5:1对比度
- **大文本**: 最低3:1对比度
- **UI组件**: 最低3:1对比度
- **状态指示**: 色彩+图标双重反馈

## 实施计划

### Phase 1: 基础设施升级 (Week 1-2)

1. **Tailwind配置优化** - 扩展颜色系统和设计token
2. **CSS变量重构** - 建立完整的设计token体系
3. **组件目录重构** - 按新架构重组组件结构

### Phase 2: 核心组件开发 (Week 3-4)

1. **UI基础组件** - Button, Input, Card等升级
2. **布局组件** - Header, Sidebar, Main容器
3. **动画系统** - 基础动画和过渡效果

### Phase 3: 音频专用组件 (Week 5-6)

1. **音频播放器** - 核心播放控制组件
2. **波形显示** - 音频可视化组件
3. **转录编辑器** - 文本同步编辑组件

### Phase 4: 集成和优化 (Week 7-8)

1. **主题系统完善** - 深浅主题切换
2. **响应式优化** - 多设备适配测试
3. **性能优化** - 组件懒加载和代码分割

## 技术实施策略

### 1. 渐进式升级

- 保持现有组件的API兼容性
- 逐步替换和升级现有组件
- 新功能优先使用新设计系统

### 2. TypeScript支持

```typescript
// 设计token的类型定义
interface DesignTokens {
  colors: ColorPalette
  spacing: SpacingScale
  typography: TypographyScale
  shadows: ShadowScale
  animations: AnimationConfig
}

// 组件变体的类型定义
interface ComponentVariants {
  variant: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg' | 'xl'
  state?: 'default' | 'loading' | 'disabled'
}
```

### 3. 组件文档和测试

- **Storybook集成** - 组件展示和交互测试
- **单元测试** - Jest + React Testing Library
- **视觉回归测试** - Chromatic集成
- **可访问性测试** - axe-core自动化测试

## 成功指标

### 开发效率指标

- 🎯 新组件开发时间减少50%
- 🎯 设计到开发交付时间减少40%
- 🎯 UI一致性问题减少80%

### 用户体验指标

- 🎯 页面加载时间<2秒
- 🎯 音频播放延迟<100ms
- 🎯 WCAG 2.1 AA级别可访问性合规

### 技术质量指标

- 🎯 组件测试覆盖率>90%
- 🎯 设计token使用率>95%
- 🎯 CSS包大小减少30%

## 总结

这套设计系统架构充分借鉴了Shiro项目的优秀实践，同时针对autoshow的音频处理场景进行了专门优化。通过系统化的设计token、层次化的组件架构和渐进式的实施计划，将为autoshow构建一个现代、可扩展、用户友好的设计系统。

下一步将开始实施Tailwind配置优化，为整个设计系统奠定技术基础。
