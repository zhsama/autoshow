import { useAtom } from 'jotai'
import type { ShowNoteMetadata, TranscriptionCosts } from '@autoshow/shared'
import {
  metadataImmerAtom,
  transcriptionCostsImmerAtom,
  llmCostsImmerAtom,
  batchUpdateAtom,
  resetMetadataAtom,
  resetTranscriptionCostsAtom,
  resetLlmCostsAtom,
} from '../immer-utils'

export function useMetadataImmer() {
  const [metadata, setMetadata] = useAtom(metadataImmerAtom)
  const [, resetMetadata] = useAtom(resetMetadataAtom)

  const updateTitle = (title: string) => {
    setMetadata(draft => {
      draft.title = title
    })
  }

  const updateDescription = (description: string) => {
    setMetadata(draft => {
      draft.description = description
    })
  }

  const updatePublishDate = (publishDate: string) => {
    setMetadata(draft => {
      draft.publishDate = publishDate
    })
  }

  const updateMultipleFields = (updates: Partial<ShowNoteMetadata>) => {
    setMetadata(draft => {
      Object.assign(draft, updates)
    })
  }

  return {
    metadata,
    setMetadata,
    updateTitle,
    updateDescription,
    updatePublishDate,
    updateMultipleFields,
    resetMetadata,
  }
}

export function useTranscriptionCostsImmer() {
  const [costs, setCosts] = useAtom(transcriptionCostsImmerAtom)
  const [, resetCosts] = useAtom(resetTranscriptionCostsAtom)

  const addServiceCost = (service: string, modelId: string, cost: number) => {
    setCosts(draft => {
      if (!draft[service]) {
        draft[service] = []
      }
      draft[service].push({ modelId, cost })
    })
  }

  const updateServiceCost = (
    service: string,
    modelId: string,
    newCost: number
  ) => {
    setCosts(draft => {
      const serviceArray = draft[service]
      if (serviceArray) {
        const item = serviceArray.find(item => item.modelId === modelId)
        if (item) {
          item.cost = newCost
        }
      }
    })
  }

  const removeServiceCost = (service: string, modelId: string) => {
    setCosts(draft => {
      const serviceArray = draft[service]
      if (serviceArray) {
        const index = serviceArray.findIndex(item => item.modelId === modelId)
        if (index !== -1) {
          serviceArray.splice(index, 1)
        }
      }
    })
  }

  return {
    costs,
    setCosts,
    addServiceCost,
    updateServiceCost,
    removeServiceCost,
    resetCosts,
  }
}

/**
 * 增强的LLM costs hook - 支持Record类型的复杂更新
 */
export function useLlmCostsImmer() {
  const [costs, setCosts] = useAtom(llmCostsImmerAtom)
  const [, resetCosts] = useAtom(resetLlmCostsAtom)

  // 设置整个服务的成本数据
  const setServiceCosts = (
    service: string,
    costData: { modelId: string; cost: number }[]
  ) => {
    setCosts(draft => {
      draft[service] = costData
    })
  }

  // 添加到特定服务
  const addCostToService = (service: string, modelId: string, cost: number) => {
    setCosts(draft => {
      if (!draft[service]) {
        draft[service] = []
      }
      draft[service].push({ modelId, cost })
    })
  }

  // 批量更新多个服务
  const updateMultipleServices = (
    updates: Record<string, { modelId: string; cost: number }[]>
  ) => {
    setCosts(draft => {
      Object.assign(draft, updates)
    })
  }

  return {
    costs,
    setCosts, // immer-enabled setter
    setServiceCosts,
    addCostToService,
    updateMultipleServices,
    resetCosts,
  }
}

/**
 * 全局批量更新hook - 支持跨多个atoms的协调更新
 */
export function useBatchUpdate() {
  const [, batchUpdate] = useAtom(batchUpdateAtom)

  // 协调的表单重置（仅重置复杂对象）
  const resetComplexState = () => {
    batchUpdate({
      metadata: draft => {
        // 清空所有属性
        Object.assign(draft, {})
      },
      transcriptionCosts: draft => {
        // 清空所有属性
        Object.assign(draft, {})
      },
      llmCosts: draft => {
        // 清空所有属性
        Object.assign(draft, {})
      },
    })
  }

  // 处理文件上传后的状态更新
  const handleFileUploadComplete = (
    metadata: Partial<ShowNoteMetadata>,
    transcriptionCosts: TranscriptionCosts
  ) => {
    batchUpdate({
      metadata: draft => {
        Object.assign(draft, metadata)
      },
      transcriptionCosts: draft => {
        Object.assign(draft, transcriptionCosts)
      },
    })
  }

  return {
    batchUpdate,
    resetComplexState,
    handleFileUploadComplete,
  }
}
