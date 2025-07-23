'use client'

import { useState } from 'react'
import { PROMPT_CHOICES } from '@autoshow/shared'
import type { TranscriptionCosts } from '@autoshow/shared'

const l = console.log
const err = console.error

interface LLMCostData {
  modelId: string
  cost: number
}

interface TranscriptionStepProps {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  setError: (value: string | null) => void
  transcriptionService: string
  setTranscriptionService: (value: string) => void
  transcriptionModel: string
  setTranscriptionModel: (value: string) => void
  transcriptionApiKey: string
  setTranscriptionApiKey: (value: string) => void
  finalPath: string
  s3Url: string
  setTranscriptContent: (value: string) => void
  setTranscriptionModelUsed: (value: string) => void
  setTranscriptionCostUsed: (value: number | null) => void
  transcriptionCosts: TranscriptionCosts
  selectedPrompts: string[]
  setSelectedPrompts: (value: string[]) => void
  setLlmCosts: (value: Record<string, LLMCostData[]>) => void
  setPromptText: (value: string) => void
  setCurrentStep: (value: number) => void
  showNoteId: number
}

export const TranscriptionStep = (props: TranscriptionStepProps) => {
  const [showTranscript, setShowTranscript] = useState(false)
  const [transcriptData, setTranscriptData] = useState('')
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }
  
  const handleStepTwo = async (): Promise<void> => {
    l(`[TranscriptionStep] Starting transcription with ${props.transcriptionService}/${props.transcriptionModel}`)
    props.setIsLoading(true)
    props.setError(null)
    props.setTranscriptContent('')
    props.setPromptText('')
    try {
      const rtBody = {
        showNoteId: props.showNoteId.toString(),
        finalPath: props.finalPath,
        s3Url: props.s3Url,
        transcriptServices: props.transcriptionService,
        options: {
          prompt: props.selectedPrompts
        }
      } as {
        showNoteId: string
        finalPath: string
        s3Url: string
        transcriptServices: string
        options: Record<string, unknown>
      }
      rtBody.options[props.transcriptionService] = props.transcriptionModel
      if (props.transcriptionService === 'assembly') {
        rtBody.options.assemblyApiKey = props.transcriptionApiKey
      }
      if (props.transcriptionService === 'deepgram') {
        rtBody.options.deepgramApiKey = props.transcriptionApiKey
      }
      l(`[TranscriptionStep] Sending request to run-transcription API with showNoteId: ${props.showNoteId}`)
      const rtRes = await fetch('http://localhost:4321/api/run-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rtBody)
      })
      if (!rtRes.ok) {
        const errorData = await rtRes.json()
        err(`[TranscriptionStep] Transcription API error:`, errorData)
        throw new Error(`Error running transcription: ${errorData.error || rtRes.statusText}`)
      }
      const rtData = await rtRes.json() as {
        transcript?: string
        prompt?: string
        modelId?: string
        transcriptionCost?: number
        allLLMCosts?: Record<string, LLMCostData[]>
      }
      props.setTranscriptContent(rtData.transcript || '')
      setTranscriptData(rtData.transcript || '')
      props.setPromptText(rtData.prompt || '')
      if (rtData.modelId) {
        props.setTranscriptionModelUsed(rtData.modelId)
      }
      if (rtData.transcriptionCost != null) {
        props.setTranscriptionCostUsed(rtData.transcriptionCost)
      }
      if (rtData.allLLMCosts) {
        props.setLlmCosts(rtData.allLLMCosts)
      } else {
        console.warn(`[TranscriptionStep] No allLLMCosts found in response`)
        props.setLlmCosts({})
      }
      setShowTranscript(true)
      l(`[TranscriptionStep] Successfully completed transcription, moving to step 3`)
      props.setCurrentStep(3)
    } catch (error) {
      err(`[TranscriptionStep] Error in handleStepTwo:`, error)
      if (error instanceof Error) {
        props.setError(error.message)
      } else {
        props.setError('An unknown error occurred.')
      }
    } finally {
      props.setIsLoading(false)
    }
  }
  l(`[TranscriptionStep] Rendering transcription step with service: ${props.transcriptionService}`)
  return (
    <div className="space-y-6">
      <h2 className="h2">Select a Transcription Service and Prompts</h2>
      <div className="space-y-6">
        <div>
          <h3 className="h3 mb-4">Transcription Service</h3>
          {!Object.keys(props.transcriptionCosts).length && (
            <p className="text-muted-foreground">No cost data available</p>
          )}
          <div className="grid gap-4">
            {Object.entries(props.transcriptionCosts).map(([svc, models]) => (
              <div key={svc} className="bg-base-800 p-4 rounded-md">
                <h4 className="font-medium text-primary-400 mb-3">{svc}</h4>
                <div className="grid gap-2">
                  {models.map(m => (
                    <div key={m.modelId} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="transcriptionChoice"
                        value={`${svc}:${m.modelId}`}
                        checked={props.transcriptionService === svc && props.transcriptionModel === m.modelId}
                        onChange={() => {
                          props.setTranscriptionService(svc)
                          props.setTranscriptionModel(m.modelId)
                        }}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium">{m.modelId}</label>
                        <div className="text-sm text-muted-foreground">
                          {(m.cost * 1000).toFixed(1)} Credits (¢{(m.cost).toFixed(3)})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="transcriptionApiKey" className="block text-sm font-medium text-foreground">Transcription API Key</label>
          <input
            type="password"
            id="transcriptionApiKey"
            value={props.transcriptionApiKey}
            onChange={e => props.setTranscriptionApiKey(e.target.value)}
            className="form__input w-full py-2"
          />
        </div>
        <div>
          <h3 className="h3 mb-4">Select Prompts</h3>
          <div className="grid grid-cols-2 gap-3">
            {PROMPT_CHOICES.map(prompt => (
              <div key={prompt.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`prompt-${prompt.value}`}
                  value={prompt.value}
                  checked={props.selectedPrompts.includes(prompt.value)}
                  onChange={e => {
                    const isChecked = e.target.checked
                    if (isChecked) {
                      props.setSelectedPrompts([...props.selectedPrompts, prompt.value])
                    } else {
                      props.setSelectedPrompts(props.selectedPrompts.filter(p => p !== prompt.value))
                    }
                  }}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor={`prompt-${prompt.value}`} className="text-sm">{prompt.name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        disabled={props.isLoading}
        onClick={handleStepTwo}
        className="button button--primary"
      >
        {props.isLoading ? 'Transcribing...' : 'Generate Transcription & Continue to LLM Selection'}
      </button>
      {showTranscript && transcriptData && (
        <div>
          <h3 className="h3 mb-3">Generated Transcript</h3>
          <div className="bg-base-800 p-4 rounded-md max-h-[300px] overflow-auto">
            {formatContent(transcriptData)}
          </div>
        </div>
      )}
    </div>
  )
}