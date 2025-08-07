/**
 * 示例组件：演示immer增强的状态管理用法
 *
 * 这个组件展示了如何在AutoShow项目中使用immer增强的Jotai atoms
 * 包括metadata更新、cost管理和批量操作等常见场景
 */

import React from 'react'
import { useAtom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import {
  useMetadataImmer,
  useTranscriptionCostsImmer,
  useLlmCostsImmer,
  useBatchUpdate,
} from '../atoms/hooks/immer-hooks'
import { metadataAtom } from '../atoms'

/**
 * 元数据编辑组件 - 演示复杂对象的immer更新模式
 */
export function MetadataEditor() {
  const {
    metadata,
    updateTitle,
    updateDescription,
    updateMultipleFields,
    resetMetadata,
  } = useMetadataImmer()

  const handleBulkUpdate = () => {
    updateMultipleFields({
      title: '示例节目标题',
      description: '这是一个演示描述',
      publishDate: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">元数据编辑器（Immer增强）</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">标题:</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={metadata.title || ''}
            onChange={e => updateTitle(e.target.value)}
            placeholder="输入节目标题"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">描述:</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={metadata.description || ''}
            onChange={e => updateDescription(e.target.value)}
            placeholder="输入节目描述"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkUpdate}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            批量更新示例
          </button>
          <button
            onClick={() => resetMetadata()}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * 成本管理组件 - 演示嵌套对象和数组的immer操作
 */
export function CostManager() {
  const {
    costs: transcriptionCosts,
    addServiceCost,
    updateServiceCost,
    resetCosts: resetTranscriptionCosts,
  } = useTranscriptionCostsImmer()

  const {
    costs: llmCosts,
    addCostToService,
    resetCosts: resetLlmCosts,
  } = useLlmCostsImmer()

  const handleAddTranscriptionCost = () => {
    addServiceCost('deepgram', 'nova-2-general', 0.0043)
  }

  const handleAddLlmCost = () => {
    addCostToService('openai', 'gpt-4o-mini', 0.00015)
  }

  const handleUpdateTranscriptionCost = () => {
    updateServiceCost('deepgram', 'nova-2-general', 0.005)
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">成本管理器（Immer增强）</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">转录成本</h4>
          <div className="text-sm mb-2">
            当前成本: {JSON.stringify(transcriptionCosts, null, 2)}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddTranscriptionCost}
              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            >
              添加成本
            </button>
            <button
              onClick={handleUpdateTranscriptionCost}
              className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
            >
              更新成本
            </button>
            <button
              onClick={() => resetTranscriptionCosts()}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              重置
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">LLM成本</h4>
          <div className="text-sm mb-2">
            当前成本: {JSON.stringify(llmCosts, null, 2)}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddLlmCost}
              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            >
              添加成本
            </button>
            <button
              onClick={() => resetLlmCosts()}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 批量操作演示组件 - 展示跨多个atoms的协调更新
 */
export function BatchOperationsDemo() {
  const { batchUpdate, resetComplexState, handleFileUploadComplete } =
    useBatchUpdate()

  const handleSimulatePipelineCompletion = () => {
    handleFileUploadComplete(
      {
        title: '自动生成的节目标题',
        description: '基于AI分析的描述',
        publishDate: new Date().toISOString().split('T')[0],
      },
      {
        deepgram: [{ modelId: 'nova-2', cost: 0.0043 }],
        assemblyai: [{ modelId: 'best', cost: 0.0065 }],
      }
    )
  }

  const handleComplexUpdate = () => {
    batchUpdate({
      metadata: draft => {
        draft.title = '批量更新的标题'
        draft.channel = '示例频道'
      },
      transcriptionCosts: draft => {
        draft['whisper'] = [{ modelId: 'large-v3', cost: 0.006 }]
      },
      llmCosts: draft => {
        draft['anthropic'] = [{ modelId: 'claude-3.5-sonnet', cost: 0.003 }]
      },
    })
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">批量操作演示</h3>

      <div className="space-x-2">
        <button
          onClick={handleSimulatePipelineCompletion}
          className="px-3 py-2 bg-purple-500 text-white rounded"
        >
          模拟管道完成
        </button>
        <button
          onClick={handleComplexUpdate}
          className="px-3 py-2 bg-indigo-500 text-white rounded"
        >
          复杂批量更新
        </button>
        <button
          onClick={() => resetComplexState()}
          className="px-3 py-2 bg-gray-500 text-white rounded"
        >
          重置所有复杂状态
        </button>
      </div>
    </div>
  )
}

/**
 * 对比演示组件 - 展示传统方式 vs Immer方式的差异
 */
export function ComparisonDemo() {
  // 传统方式
  const [metadata, setMetadata] = useAtom(metadataAtom)

  // Immer方式
  const [, setMetadataImmer] = useImmerAtom(metadataAtom)

  const handleTraditionalUpdate = () => {
    setMetadata(prev => ({
      ...prev,
      title: '传统方式更新',
      description: '需要手动展开操作符',
    }))
  }

  const handleImmerUpdate = () => {
    setMetadataImmer(draft => {
      draft.title = 'Immer方式更新'
      draft.description = '直接修改draft对象'
    })
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">传统 vs Immer 对比</h3>

      <div className="mb-4">
        <div className="text-sm bg-gray-100 p-2 rounded">
          当前metadata: {JSON.stringify(metadata, null, 2)}
        </div>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleTraditionalUpdate}
          className="px-3 py-2 bg-orange-500 text-white rounded"
        >
          传统方式更新
        </button>
        <button
          onClick={handleImmerUpdate}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Immer方式更新
        </button>
      </div>
    </div>
  )
}

/**
 * 综合演示页面 - 组合所有演示组件
 */
export function ImmerIntegrationDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        AutoShow Immer集成演示
      </h1>

      <MetadataEditor />
      <CostManager />
      <BatchOperationsDemo />
      <ComparisonDemo />

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h4 className="font-medium mb-2">使用说明：</h4>
        <ul className="text-sm space-y-1">
          <li>
            • <strong>元数据编辑器</strong>：演示复杂对象的immer风格更新
          </li>
          <li>
            • <strong>成本管理器</strong>：展示嵌套数组和Record类型的操作
          </li>
          <li>
            • <strong>批量操作</strong>：演示跨多个atoms的协调更新
          </li>
          <li>
            • <strong>对比演示</strong>：比较传统方式和immer方式的差异
          </li>
        </ul>
      </div>
    </div>
  )
}
