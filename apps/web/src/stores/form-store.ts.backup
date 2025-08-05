import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProcessTypeEnum, LLMServiceKey, ShowNoteMetadata, TranscriptionCosts } from '@autoshow/shared'

interface LLMCostData {
  modelId: string
  cost: number
}

interface FormState {
  // Wallet
  walletAddress: string
  mnemonic: string
  dashBalance: number | null
  
  // Process Type
  processType: ProcessTypeEnum
  url: string
  filePath: string
  finalPath: string
  s3Url: string
  
  // Metadata
  metadata: Partial<ShowNoteMetadata>
  frontMatter: string
  showNoteId: number
  
  // Transcription
  transcriptionService: string
  transcriptionModel: string
  transcriptionModelUsed: string
  transcriptionApiKey: string
  transcriptionCosts: TranscriptionCosts
  transcriptionCostUsed: number | null
  transcriptContent: string
  
  // Prompts
  selectedPrompts: string[]
  promptText: string
  
  // LLM
  llmService: LLMServiceKey
  llmModel: string
  llmApiKey: string
  llmCosts: Record<string, LLMCostData[]>
  
  // UI State
  currentStep: number
  isLoading: boolean
  error: string | null
}

interface FormActions {
  // Wallet Actions
  setWalletAddress: (address: string) => void
  setMnemonic: (mnemonic: string) => void
  setDashBalance: (balance: number | null) => void
  
  // Process Type Actions
  setProcessType: (type: ProcessTypeEnum) => void
  setUrl: (url: string) => void
  setFilePath: (path: string) => void
  setFinalPath: (path: string) => void
  setS3Url: (url: string) => void
  
  // Metadata Actions
  setMetadata: (metadata: Partial<ShowNoteMetadata>) => void
  setFrontMatter: (frontMatter: string) => void
  setShowNoteId: (id: number) => void
  
  // Transcription Actions
  setTranscriptionService: (service: string) => void
  setTranscriptionModel: (model: string) => void
  setTranscriptionModelUsed: (model: string) => void
  setTranscriptionApiKey: (key: string) => void
  setTranscriptionCosts: (costs: TranscriptionCosts) => void
  setTranscriptionCostUsed: (cost: number | null) => void
  setTranscriptContent: (content: string) => void
  
  // Prompt Actions
  setSelectedPrompts: (prompts: string[]) => void
  setPromptText: (text: string) => void
  
  // LLM Actions
  setLlmService: (service: LLMServiceKey) => void
  setLlmModel: (model: string) => void
  setLlmApiKey: (key: string) => void
  setLlmCosts: (costs: Record<string, LLMCostData[]>) => void
  
  // UI Actions
  setCurrentStep: (step: number) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Utility Actions
  resetForm: () => void
}

type FormStore = FormState & FormActions

const initialState: FormState = {
  // Wallet
  walletAddress: 'yhGfbjKDuTnJyx8wzje7n9wsoWC51WH7Y5',
  mnemonic: 'tip punch promote click scheme guitar skirt lucky hamster clip denial ecology',
  dashBalance: null,
  
  // Process Type
  processType: 'video',
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
  llmService: 'chatgpt',
  llmModel: 'gpt-4o-mini',
  llmApiKey: '',
  llmCosts: {},
  
  // UI State
  currentStep: 1,
  isLoading: false,
  error: null,
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set) => ({
      ...initialState,
      
      // Wallet Actions
      setWalletAddress: (address) => set({ walletAddress: address }),
      setMnemonic: (mnemonic) => set({ mnemonic }),
      setDashBalance: (balance) => set({ dashBalance: balance }),
      
      // Process Type Actions
      setProcessType: (type) => set({ processType: type }),
      setUrl: (url) => set({ url }),
      setFilePath: (path) => set({ filePath: path }),
      setFinalPath: (path) => set({ finalPath: path }),
      setS3Url: (url) => set({ s3Url: url }),
      
      // Metadata Actions
      setMetadata: (metadata) => set({ metadata }),
      setFrontMatter: (frontMatter) => set({ frontMatter }),
      setShowNoteId: (id) => set({ showNoteId: id }),
      
      // Transcription Actions
      setTranscriptionService: (service) => set({ transcriptionService: service }),
      setTranscriptionModel: (model) => set({ transcriptionModel: model }),
      setTranscriptionModelUsed: (model) => set({ transcriptionModelUsed: model }),
      setTranscriptionApiKey: (key) => set({ transcriptionApiKey: key }),
      setTranscriptionCosts: (costs) => set({ transcriptionCosts: costs }),
      setTranscriptionCostUsed: (cost) => set({ transcriptionCostUsed: cost }),
      setTranscriptContent: (content) => set({ transcriptContent: content }),
      
      // Prompt Actions
      setSelectedPrompts: (prompts) => set({ selectedPrompts: prompts }),
      setPromptText: (text) => set({ promptText: text }),
      
      // LLM Actions
      setLlmService: (service) => set({ llmService: service }),
      setLlmModel: (model) => set({ llmModel: model }),
      setLlmApiKey: (key) => set({ llmApiKey: key }),
      setLlmCosts: (costs) => set({ llmCosts: costs }),
      
      // UI Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Utility Actions
      resetForm: () => set(initialState),
    }),
    {
      name: 'form-store',
    }
  )
)