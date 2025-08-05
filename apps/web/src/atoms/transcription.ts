import { atom } from 'jotai'
import type { TranscriptionCosts } from '@autoshow/shared'

// 转录相关atoms
export const transcriptionServiceAtom = atom('deepgram')
export const transcriptionModelAtom = atom('nova-2')
export const transcriptionModelUsedAtom = atom('')
export const transcriptionApiKeyAtom = atom('')
export const transcriptionCostsAtom = atom<TranscriptionCosts>({})
export const transcriptionCostUsedAtom = atom<number | null>(null)
export const transcriptContentAtom = atom('')

// 提示词相关atoms
export const selectedPromptsAtom = atom(['shortSummary'])
export const promptTextAtom = atom('')
