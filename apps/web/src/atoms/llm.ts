import { atom } from 'jotai'
import type { LLMServiceKey } from '@autoshow/shared'

interface LLMCostData {
  modelId: string
  cost: number
}

// LLM相关atoms
export const llmServiceAtom = atom<LLMServiceKey>('chatgpt')
export const llmModelAtom = atom('gpt-4o-mini')
export const llmApiKeyAtom = atom('')
export const llmCostsAtom = atom<Record<string, LLMCostData[]>>({})
