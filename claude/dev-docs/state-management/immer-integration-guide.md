# Immer集成指南

本指南说明如何在AutoShow项目中使用Immer来简化复杂状态更新。

## 概述

项目已集成Immer与Jotai，提供更直观的不可变状态更新方式。这特别适用于复杂对象和嵌套数据结构的更新。

## 可用工具

### 1. Immer增强的Atoms

```typescript
import {
  batchUpdateAtom, // 批量更新工具
  llmCostsImmerAtom, // LLM成本的immer版本
  metadataImmerAtom, // 原metadata atom的immer版本
  transcriptionCostsImmerAtom, // 转录成本的immer版本
} from '@/atoms'
```

### 2. 增强的Hooks

```typescript
import {
  useBatchUpdate,
  useLlmCostsImmer,
  useMetadataImmer,
  useTranscriptionCostsImmer,
} from '@/atoms/hooks/immer-hooks'
```

### 3. 创建新的Immer Atoms

```typescript
import { createImmerAtom } from '@/atoms/immer-utils'

// 创建新的复杂状态atom
const myComplexAtom = createImmerAtom({
  nested: {
    data: [],
    config: {},
  },
})
```

## 使用示例

### 基本元数据更新

```typescript
function MyComponent() {
  const { metadata, updateTitle, setMetadata } = useMetadataImmer()

  // 简单属性更新
  const handleTitleChange = (title: string) => {
    updateTitle(title)
  }

  // 复杂更新
  const handleComplexUpdate = () => {
    setMetadata(draft => {
      draft.title = '新标题'
      draft.description = '新描述'
      draft.publishDate = new Date().toISOString().split('T')[0]
      // 直接修改draft，无需展开操作符
    })
  }

  return (
    <div>
      <h1>{metadata.title}</h1>
      <button onClick={() => handleTitleChange('更新的标题')}>
        更新标题
      </button>
    </div>
  )
}
```

### 复杂嵌套结构更新

```typescript
function CostCalculator() {
  const { addServiceCost, updateServiceCost } = useTranscriptionCostsImmer()

  const handleAddCost = () => {
    // 添加新的服务成本，自动处理数组初始化
    addServiceCost('deepgram', 'nova-2-general', 0.0043)
  }

  const handleUpdateCost = () => {
    // 更新现有成本，自动查找和修改
    updateServiceCost('deepgram', 'nova-2-general', 0.005)
  }

  return (
    <div>
      <button onClick={handleAddCost}>添加成本</button>
      <button onClick={handleUpdateCost}>更新成本</button>
    </div>
  )
}
```

### 批量操作

```typescript
function PipelineHandler() {
  const { batchUpdate, resetComplexState } = useBatchUpdate()

  const handlePipelineComplete = () => {
    // 一次性更新多个相关状态
    batchUpdate({
      metadata: (draft) => {
        draft.title = '处理完成的标题'
        draft.publishDate = new Date().toISOString().split('T')[0]
      },
      transcriptionCosts: (draft) => {
        draft['whisper'] = [{ modelId: 'large-v3', cost: 0.006 }]
      }
    })
  }

  return (
    <div>
      <button onClick={handlePipelineComplete}>完成处理</button>
      <button onClick={resetComplexState}>重置所有</button>
    </div>
  )
}
```

## 何时使用Immer

### ✅ 适合使用的场景

- **复杂对象更新**：多个属性需要同时修改
- **嵌套数据结构**：数组中的对象、对象中的数组
- **条件性更新**：基于现有值的复杂逻辑更新
- **批量操作**：需要协调多个atoms的更新

### ❌ 不适合使用的场景

- **简单值更新**：单个字符串、数字的直接设置
- **高频操作**：每秒多次的更新（如动画）
- **性能敏感场景**：需要最小开销的更新

## 迁移策略

1. **保持现有代码**：原有atoms和hooks继续正常工作
2. **渐进式采用**：只在复杂更新场景使用immer版本
3. **混合使用**：同一组件可以同时使用传统和immer方式
4. **向前兼容**：新功能优先考虑immer模式

## 性能考虑

- Immer有轻微的性能开销（~1-5%）
- 复杂对象更新的收益通常超过开销
- 简单状态继续使用原子化的直接更新
- 大型数组操作时考虑性能测试

## 演示组件

在 `src/components/ImmerDemo.tsx` 中提供了完整的使用演示，包括：

- 元数据编辑器
- 成本管理器
- 批量操作演示
- 传统vs Immer对比

可以在开发模式下集成此组件来测试immer功能。
