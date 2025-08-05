import { atom } from 'jotai'

// UI状态相关atoms
export const currentStepAtom = atom(1)
export const isLoadingAtom = atom(false)
export const errorAtom = atom<string | null>(null)
