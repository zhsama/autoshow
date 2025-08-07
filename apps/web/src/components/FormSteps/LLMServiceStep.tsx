'use client'

import { useLLMStep } from '@/hooks/use-form-steps'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { logger } from '@/lib/logger'
import { L_CONFIG, type LLMServiceKey } from '@autoshow/shared'
import { createShowNote } from '@/app/actions/show-notes'

interface LLMServiceStepProps {
  onNewShowNote: () => void
}

export function LLMServiceStep({ onNewShowNote }: LLMServiceStepProps) {
  const {
    llmService,
    llmModel,
    llmApiKey,
    frontMatter,
    promptText,
    transcript,
    transcriptionService,
    transcriptionModelUsed,
    transcriptionCostUsed,
    metadata,
    showNoteId,
    isLoading,
    setLlmService,
    setLlmModel,
    setLlmApiKey,
    setIsLoading,
    setError,
  } = useLLMStep()

  const handleGenerateShowNotes = async () => {
    logger.log('[LLMServiceStep] Starting LLM generation')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/run-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showNoteId: showNoteId.toString(),
          llmServices: llmService,
          options: {
            frontMatter,
            promptText,
            transcript,
            llmApiKey,
            [llmService]: llmModel,
            transcriptionServices: transcriptionService,
            transcriptionModel: transcriptionModelUsed,
            transcriptionCost: transcriptionCostUsed,
            metadata,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate show notes')
      }

      const data = await response.json()

      // Create show note using Server Action
      const result = await createShowNote({
        id: showNoteId,
        title: metadata.title || 'Untitled',
        description: metadata.description,
        publishDate: new Date().toISOString(),
        transcript,
        llmOutput: data.llmOutput,
        content: data.content,
        frontmatter: frontMatter,
        prompt: promptText,
        llmService,
        llmModel,
        llmCost: data.llmCost,
        transcriptionService,
        transcriptionModel: transcriptionModelUsed,
        transcriptionCost: transcriptionCostUsed || undefined,
        finalCost: (data.llmCost || 0) + (transcriptionCostUsed || 0),
        ...metadata,
      })

      if (result.success) {
        logger.log('[LLMServiceStep] Show notes generated successfully')
        onNewShowNote()
      } else {
        throw new Error(result.error || 'Failed to save show note')
      }
    } catch (error) {
      logger.error('[LLMServiceStep] Error generating show notes:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to generate show notes'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const selectedService =
    llmService && llmService !== 'skip'
      ? L_CONFIG[llmService as keyof typeof L_CONFIG]
      : null

  return (
    <>
      <CardHeader>
        <CardTitle>LLM Processing</CardTitle>
        <CardDescription>
          Select an AI model to generate show notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="llm-service">LLM Service</Label>
          <Select
            value={llmService}
            onValueChange={value => setLlmService(value as LLMServiceKey)}
          >
            <SelectTrigger id="llm-service">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(L_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedService && selectedService.models.length > 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="llm-model">Model</Label>
              <Select value={llmModel} onValueChange={setLlmModel}>
                <SelectTrigger id="llm-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedService.models.map(model => (
                    <SelectItem key={model.modelId} value={model.modelId}>
                      {model.modelName} - $
                      {((model.inputCostC + model.outputCostC) / 10000).toFixed(
                        4
                      )}
                      /1K tokens
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="llm-api-key">API Key</Label>
              <Input
                id="llm-api-key"
                type="password"
                value={llmApiKey}
                onChange={e => setLlmApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Processing Summary</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Transcription: {transcriptionService} - {transcriptionModelUsed}
            </p>
            <p>Selected Prompts: {promptText}</p>
            {transcript && (
              <p>Transcript Length: {transcript.split(' ').length} words</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Start Over
        </Button>
        <Button
          onClick={handleGenerateShowNotes}
          disabled={
            isLoading ||
            llmService === ('skip' as LLMServiceKey) ||
            (llmService !== ('skip' as LLMServiceKey) &&
              (!llmApiKey || llmApiKey.trim() === ''))
          }
        >
          {isLoading ? 'Generating...' : 'Generate Show Notes'}
        </Button>
      </CardFooter>
    </>
  )
}
