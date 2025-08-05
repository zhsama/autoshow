import { useAtom } from 'jotai'
import {
  transcriptionServiceAtom,
  transcriptionModelAtom,
  transcriptionApiKeyAtom,
  transcriptionCostsAtom,
  selectedPromptsAtom,
  transcriptContentAtom,
  transcriptionModelUsedAtom,
  transcriptionCostUsedAtom,
  promptTextAtom,
} from '../transcription'
import { finalPathAtom, s3UrlAtom, showNoteIdAtom } from '../process'
import { llmCostsAtom } from '../llm'
import { isLoadingAtom, errorAtom, currentStepAtom } from '../ui'

export function useTranscriptionStep() {
  const [transcriptionService, setTranscriptionService] = useAtom(
    transcriptionServiceAtom
  )
  const [transcriptionModel, setTranscriptionModel] = useAtom(
    transcriptionModelAtom
  )
  const [transcriptionApiKey, setTranscriptionApiKey] = useAtom(
    transcriptionApiKeyAtom
  )
  const [transcriptionCosts] = useAtom(transcriptionCostsAtom)
  const [selectedPrompts, setSelectedPrompts] = useAtom(selectedPromptsAtom)
  const [finalPath] = useAtom(finalPathAtom)
  const [s3Url] = useAtom(s3UrlAtom)
  const [showNoteId] = useAtom(showNoteIdAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [, setCurrentStep] = useAtom(currentStepAtom)
  const [, setTranscriptContent] = useAtom(transcriptContentAtom)
  const [, setTranscriptionModelUsed] = useAtom(transcriptionModelUsedAtom)
  const [, setTranscriptionCostUsed] = useAtom(transcriptionCostUsedAtom)
  const [, setLlmCosts] = useAtom(llmCostsAtom)
  const [, setPromptText] = useAtom(promptTextAtom)

  return {
    transcriptionService,
    transcriptionModel,
    transcriptionApiKey,
    transcriptionCosts,
    selectedPrompts,
    finalPath,
    s3Url,
    showNoteId,
    isLoading,
    error,
    setTranscriptionService,
    setTranscriptionModel,
    setTranscriptionApiKey,
    setTranscriptContent,
    setTranscriptionModelUsed,
    setTranscriptionCostUsed,
    setSelectedPrompts,
    setLlmCosts,
    setPromptText,
    setIsLoading,
    setError,
    setCurrentStep,
  }
}
