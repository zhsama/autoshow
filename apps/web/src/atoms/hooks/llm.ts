import { useAtom } from 'jotai'
import {
  llmServiceAtom,
  llmModelAtom,
  llmApiKeyAtom,
  llmCostsAtom,
} from '../llm'
import {
  transcriptContentAtom,
  transcriptionServiceAtom,
  transcriptionModelUsedAtom,
  transcriptionCostUsedAtom,
  promptTextAtom,
} from '../transcription'
import { frontMatterAtom, metadataAtom, showNoteIdAtom } from '../process'
import { isLoadingAtom, errorAtom } from '../ui'

export function useLLMStep() {
  const [llmService, setLlmService] = useAtom(llmServiceAtom)
  const [llmModel, setLlmModel] = useAtom(llmModelAtom)
  const [llmApiKey, setLlmApiKey] = useAtom(llmApiKeyAtom)
  const [llmCosts] = useAtom(llmCostsAtom)
  const [frontMatter] = useAtom(frontMatterAtom)
  const [promptText] = useAtom(promptTextAtom)
  const [transcriptContent] = useAtom(transcriptContentAtom)
  const [transcriptionService] = useAtom(transcriptionServiceAtom)
  const [transcriptionModelUsed] = useAtom(transcriptionModelUsedAtom)
  const [transcriptionCostUsed] = useAtom(transcriptionCostUsedAtom)
  const [metadata] = useAtom(metadataAtom)
  const [showNoteId] = useAtom(showNoteIdAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)

  return {
    llmService,
    llmModel,
    llmApiKey,
    llmCosts,
    frontMatter,
    promptText,
    transcript: transcriptContent,
    transcriptionService,
    transcriptionModelUsed,
    transcriptionCostUsed,
    metadata,
    showNoteId,
    isLoading,
    error,
    setLlmService,
    setLlmModel,
    setLlmApiKey,
    setIsLoading,
    setError,
  }
}
