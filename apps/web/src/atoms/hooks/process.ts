import { useAtom } from 'jotai'
import {
  processTypeAtom,
  urlAtom,
  filePathAtom,
  finalPathAtom,
  s3UrlAtom,
  metadataAtom,
  frontMatterAtom,
  showNoteIdAtom,
} from '../process'
import { walletAddressAtom } from '../wallet'
import { transcriptionCostsAtom } from '../transcription'
import { isLoadingAtom, errorAtom, currentStepAtom } from '../ui'
import { metadataImmerAtom, transcriptionCostsImmerAtom } from '../immer-utils'

export function useProcessTypeStep() {
  const [processType, setProcessType] = useAtom(processTypeAtom)
  const [url, setUrl] = useAtom(urlAtom)
  const [filePath, setFilePath] = useAtom(filePathAtom)
  const [, setFinalPath] = useAtom(finalPathAtom)
  const [, setS3Url] = useAtom(s3UrlAtom)
  const [, setFrontMatter] = useAtom(frontMatterAtom)
  const [, setMetadata] = useAtom(metadataAtom)
  const [, setTranscriptionCosts] = useAtom(transcriptionCostsAtom)
  const [, setShowNoteId] = useAtom(showNoteIdAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [, setCurrentStep] = useAtom(currentStepAtom)
  const [walletAddress] = useAtom(walletAddressAtom)

  const [, setMetadataImmer] = useAtom(metadataImmerAtom)
  const [, setTranscriptionCostsImmer] = useAtom(transcriptionCostsImmerAtom)

  const updateMetadataFromFile = (fileData: {
    title?: string
    description?: string
    publishDate?: string
  }) => {
    setMetadataImmer(draft => {
      if (fileData.title) draft.title = fileData.title
      if (fileData.description) draft.description = fileData.description
      if (fileData.publishDate) draft.publishDate = fileData.publishDate
      draft.walletAddress = walletAddress
    })
  }

  const addTranscriptionCost = (
    service: string,
    modelId: string,
    cost: number
  ) => {
    setTranscriptionCostsImmer(draft => {
      if (!draft[service]) {
        draft[service] = []
      }
      const existing = draft[service].find(item => item.modelId === modelId)
      if (!existing) {
        draft[service].push({ modelId, cost })
      } else {
        existing.cost = cost // 更新现有成本
      }
    })
  }

  return {
    processType,
    url,
    filePath,
    isLoading,
    error,
    walletAddress,
    setProcessType,
    setUrl,
    setFilePath,
    setFinalPath,
    setS3Url,
    setFrontMatter,
    setMetadata,
    setTranscriptionCosts,
    setIsLoading,
    setError,
    setCurrentStep,
    setShowNoteId,
    updateMetadataFromFile,
    addTranscriptionCost,
  }
}
