'use client'

import { useTranscriptionStep } from '@/hooks/use-form-steps'
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
import { Checkbox } from '@/components/ui/checkbox'
import { logger } from '@/lib/logger'
import { T_CONFIG, PROMPT_CHOICES } from '@autoshow/shared'

export function TranscriptionStep() {
  const {
    transcriptionService,
    transcriptionModel,
    transcriptionApiKey,
    selectedPrompts,
    finalPath,
    s3Url,
    isLoading,
    setTranscriptionService,
    setTranscriptionModel,
    setTranscriptionApiKey,
    setTranscriptContent,
    setTranscriptionModelUsed,
    setTranscriptionCostUsed,
    setSelectedPrompts,
    setPromptText,
    setIsLoading,
    setError,
    setCurrentStep,
  } = useTranscriptionStep()

  const handleTranscribe = async () => {
    logger.log('[TranscriptionStep] Starting transcription')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/run-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcriptionService,
          transcriptionModel,
          audioPath: finalPath,
          s3Url,
          apiKey: transcriptionApiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const data = await response.json()
      setTranscriptContent(data.transcript)
      setTranscriptionModelUsed(data.transcriptionModelUsed)
      setTranscriptionCostUsed(data.transcriptionCostUsed)

      // Generate prompt text based on selected prompts
      const promptText = selectedPrompts
        .map(promptKey => {
          const prompt = PROMPT_CHOICES.find(p => p.value === promptKey)
          return prompt ? prompt.name : promptKey
        })
        .join(', ')
      setPromptText(promptText)

      logger.log('[TranscriptionStep] Transcription completed')
      setCurrentStep(3)
    } catch (error) {
      logger.error('[TranscriptionStep] Error during transcription:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to transcribe audio'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptToggle = (promptValue: string) => {
    const current = selectedPrompts
    const updated = current.includes(promptValue)
      ? current.filter(p => p !== promptValue)
      : [...current, promptValue]
    setSelectedPrompts(updated)
  }

  const selectedService =
    T_CONFIG[transcriptionService as keyof typeof T_CONFIG]

  return (
    <>
      <CardHeader>
        <CardTitle>Transcription Settings</CardTitle>
        <CardDescription>
          Configure transcription service and select output formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="transcription-service">Transcription Service</Label>
          <Select
            value={transcriptionService}
            onValueChange={setTranscriptionService}
          >
            <SelectTrigger id="transcription-service">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(T_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedService && (
          <div className="space-y-2">
            <Label htmlFor="transcription-model">Model</Label>
            <Select
              value={transcriptionModel}
              onValueChange={setTranscriptionModel}
            >
              <SelectTrigger id="transcription-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedService.models.map(model => (
                  <SelectItem key={model.modelId} value={model.modelId}>
                    {model.modelId} - $
                    {(model.costPerMinuteCents / 100).toFixed(2)}/min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={transcriptionApiKey}
            onChange={e => setTranscriptionApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
        </div>

        <div className="space-y-2">
          <Label>Output Formats</Label>
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {PROMPT_CHOICES.map(prompt => (
              <div key={prompt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={prompt.value}
                  checked={selectedPrompts.includes(prompt.value)}
                  onCheckedChange={() => handlePromptToggle(prompt.value)}
                />
                <Label
                  htmlFor={prompt.value}
                  className="text-sm cursor-pointer"
                >
                  {prompt.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button
          onClick={handleTranscribe}
          disabled={
            isLoading || !transcriptionApiKey || selectedPrompts.length === 0
          }
        >
          {isLoading ? 'Transcribing...' : 'Transcribe & Continue'}
        </Button>
      </CardFooter>
    </>
  )
}
