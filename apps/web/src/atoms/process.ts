import { atom } from 'jotai'
import type { ProcessTypeEnum, ShowNoteMetadata } from '@autoshow/shared'

// 处理类型相关atoms
export const processTypeAtom = atom<ProcessTypeEnum>('video')
export const urlAtom = atom('https://www.youtube.com/watch?v=MORMZXEaONk')
export const filePathAtom = atom('autoshow/content/examples/audio.mp3')
export const finalPathAtom = atom('')
export const s3UrlAtom = atom('')

// 元数据相关atoms
export const metadataAtom = atom<Partial<ShowNoteMetadata>>({})
export const frontMatterAtom = atom('')
export const showNoteIdAtom = atom(0)
