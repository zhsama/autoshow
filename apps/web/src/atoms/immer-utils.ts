import { withImmer, atomWithImmer } from 'jotai-immer'
import { atom } from 'jotai'
import type { WritableAtom } from 'jotai'
import type { Draft } from 'immer'
import type { ShowNoteMetadata, TranscriptionCosts } from '@autoshow/shared'
import { metadataAtom, transcriptionCostsAtom, llmCostsAtom } from './index'

export const metadataImmerAtom = withImmer(metadataAtom)
export const transcriptionCostsImmerAtom = withImmer(transcriptionCostsAtom)
export const llmCostsImmerAtom = withImmer(llmCostsAtom)

export const createImmerAtom = <T>(initialValue: T) => {
  return atomWithImmer(initialValue)
}

export const batchUpdateAtom = atom(
  null,
  (
    get,
    set,
    updates: {
      metadata?: (draft: Draft<Partial<ShowNoteMetadata>>) => void
      transcriptionCosts?: (draft: Draft<TranscriptionCosts>) => void
      llmCosts?: (
        draft: Draft<Record<string, { modelId: string; cost: number }[]>>
      ) => void
    }
  ) => {
    if (updates.metadata) {
      set(metadataImmerAtom, updates.metadata)
    }
    if (updates.transcriptionCosts) {
      set(transcriptionCostsImmerAtom, updates.transcriptionCosts)
    }
    if (updates.llmCosts) {
      set(llmCostsImmerAtom, updates.llmCosts)
    }
  }
)

export const createImmerResetAtom = <T>(
  targetAtom: WritableAtom<T, any, void>,
  initialValue: T
) => {
  return atom(null, (_get, set) => {
    set(targetAtom, () => initialValue)
  })
}

export const resetMetadataAtom = createImmerResetAtom(metadataImmerAtom, {})
export const resetTranscriptionCostsAtom = createImmerResetAtom(
  transcriptionCostsImmerAtom,
  {}
)
export const resetLlmCostsAtom = createImmerResetAtom(llmCostsImmerAtom, {})
