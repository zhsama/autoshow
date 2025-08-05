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
  }
}
