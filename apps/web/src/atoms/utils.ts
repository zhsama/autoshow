import { jotaiStore } from '@/lib/store'
import {
  walletAddressAtom,
  mnemonicAtom,
  dashBalanceAtom,
  processTypeAtom,
  urlAtom,
  filePathAtom,
  finalPathAtom,
  s3UrlAtom,
  metadataAtom,
  frontMatterAtom,
  showNoteIdAtom,
  transcriptionServiceAtom,
  transcriptionModelAtom,
  transcriptionModelUsedAtom,
  transcriptionApiKeyAtom,
  transcriptionCostsAtom,
  transcriptionCostUsedAtom,
  transcriptContentAtom,
  selectedPromptsAtom,
  promptTextAtom,
  llmServiceAtom,
  llmModelAtom,
  llmApiKeyAtom,
  llmCostsAtom,
  currentStepAtom,
  isLoadingAtom,
  errorAtom,
} from '../atoms'

// 初始状态
const initialState = {
  // Wallet
  walletAddress: 'yhGfbjKDuTnJyx8wzje7n9wsoWC51WH7Y5',
  mnemonic:
    'tip punch promote click scheme guitar skirt lucky hamster clip denial ecology',
  dashBalance: null,

  // Process Type
  processType: 'video' as const,
  url: 'https://www.youtube.com/watch?v=MORMZXEaONk',
  filePath: 'autoshow/content/examples/audio.mp3',
  finalPath: '',
  s3Url: '',

  // Metadata
  metadata: {},
  frontMatter: '',
  showNoteId: 0,

  // Transcription
  transcriptionService: 'deepgram',
  transcriptionModel: 'nova-2',
  transcriptionModelUsed: '',
  transcriptionApiKey: '',
  transcriptionCosts: {},
  transcriptionCostUsed: null,
  transcriptContent: '',

  // Prompts
  selectedPrompts: ['shortSummary'],
  promptText: '',

  // LLM
  llmService: 'chatgpt' as const,
  llmModel: 'gpt-4o-mini',
  llmApiKey: '',
  llmCosts: {},

  // UI State
  currentStep: 1,
  isLoading: false,
  error: null,
}

// 重置表单功能
export const resetForm = () => {
  jotaiStore.set(walletAddressAtom, initialState.walletAddress)
  jotaiStore.set(mnemonicAtom, initialState.mnemonic)
  jotaiStore.set(dashBalanceAtom, initialState.dashBalance)
  jotaiStore.set(processTypeAtom, initialState.processType)
  jotaiStore.set(urlAtom, initialState.url)
  jotaiStore.set(filePathAtom, initialState.filePath)
  jotaiStore.set(finalPathAtom, initialState.finalPath)
  jotaiStore.set(s3UrlAtom, initialState.s3Url)
  jotaiStore.set(metadataAtom, initialState.metadata)
  jotaiStore.set(frontMatterAtom, initialState.frontMatter)
  jotaiStore.set(showNoteIdAtom, initialState.showNoteId)
  jotaiStore.set(transcriptionServiceAtom, initialState.transcriptionService)
  jotaiStore.set(transcriptionModelAtom, initialState.transcriptionModel)
  jotaiStore.set(
    transcriptionModelUsedAtom,
    initialState.transcriptionModelUsed
  )
  jotaiStore.set(transcriptionApiKeyAtom, initialState.transcriptionApiKey)
  jotaiStore.set(transcriptionCostsAtom, initialState.transcriptionCosts)
  jotaiStore.set(transcriptionCostUsedAtom, initialState.transcriptionCostUsed)
  jotaiStore.set(transcriptContentAtom, initialState.transcriptContent)
  jotaiStore.set(selectedPromptsAtom, initialState.selectedPrompts)
  jotaiStore.set(promptTextAtom, initialState.promptText)
  jotaiStore.set(llmServiceAtom, initialState.llmService)
  jotaiStore.set(llmModelAtom, initialState.llmModel)
  jotaiStore.set(llmApiKeyAtom, initialState.llmApiKey)
  jotaiStore.set(llmCostsAtom, initialState.llmCosts)
  jotaiStore.set(currentStepAtom, initialState.currentStep)
  jotaiStore.set(isLoadingAtom, initialState.isLoading)
  jotaiStore.set(errorAtom, initialState.error)
}
