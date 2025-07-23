'use client'

import { useState } from 'react'
import { L_CONFIG } from '@autoshow/shared'
import type { LLMServiceKey, ShowNoteType, ShowNoteMetadata, LocalResult } from '@autoshow/shared'

const l = console.log
const err = console.error

interface LLMCostData {
  modelId: string
  cost: number
}

interface LLMServiceStepProps {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  setError: (value: string | null) => void
  llmService: LLMServiceKey
  setLlmService: (value: LLMServiceKey) => void
  llmModel: string
  setLlmModel: (value: string) => void
  llmApiKey: string
  setLlmApiKey: (value: string) => void
  frontMatter: string
  promptText: string
  transcript: string
  transcriptionService: string
  transcriptionModelUsed: string
  transcriptionCostUsed: number | null
  metadata: Partial<ShowNoteMetadata>
  onNewShowNote: () => void
  llmCosts: Record<string, LLMCostData[]>
  showNoteId: number
}

export const LLMServiceStep = (props: LLMServiceStepProps) => {
  const [localResult, setLocalResult] = useState<LocalResult | null>(null)
  const allServices = () => Object.values(L_CONFIG).filter(s => s.value)
  
  const handleSelectLLM = async (): Promise<void> => {
    l('[LLMServiceStep] Starting LLM generation process')
    props.setIsLoading(true)
    props.setError(null)
    setLocalResult(null)
    try {
      const serviceCosts = props.llmCosts[props.llmService as string]
      const modelCostData = Array.isArray(serviceCosts)
        ? serviceCosts.find((x: LLMCostData) => x.modelId === props.llmModel)
        : null
      const cost = modelCostData?.cost ?? 0
      const runLLMBody = {
        showNoteId: props.showNoteId.toString(),
        llmServices: props.llmService,
        options: {
          frontMatter: props.frontMatter,
          promptText: props.promptText,
          transcript: props.transcript,
          openaiApiKey: props.llmService === 'chatgpt' ? props.llmApiKey : undefined,
          anthropicApiKey: props.llmService === 'claude' ? props.llmApiKey : undefined,
          geminiApiKey: props.llmService === 'gemini' ? props.llmApiKey : undefined,
          groqApiKey: props.llmService === 'groq' ? props.llmApiKey : undefined,
          [props.llmService]: props.llmModel,
          transcriptionServices: props.transcriptionService,
          transcriptionModel: props.transcriptionModelUsed,
          transcriptionCost: props.transcriptionCostUsed,
          metadata: props.metadata,
          llmCost: cost
        }
      } as {
        showNoteId: string
        llmServices: string
        options: Record<string, unknown>
      }
      Object.keys(runLLMBody.options).forEach(key => {
        if (runLLMBody.options[key] === undefined) {
          delete runLLMBody.options[key]
        }
      })
      l(`[LLMServiceStep] Sending API request to run-llm with showNoteId: ${props.showNoteId}`)
      const runLLMRes = await fetch('http://localhost:4321/api/run-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runLLMBody)
      })
      if (!runLLMRes.ok) {
        const errorData = await runLLMRes.json()
        err(`[LLMServiceStep] API error: ${errorData.error || runLLMRes.statusText}`)
        throw new Error(`Error running LLM: ${errorData.error || runLLMRes.statusText}`)
      }
      const data = await runLLMRes.json() as {
        showNote: ShowNoteType
        showNotesResult: string
      }
      l(`[LLMServiceStep] Successfully generated show note with ID: ${data.showNote?.id}`)
      setLocalResult({ showNote: data.showNote, llmOutput: data.showNotesResult })
      props.onNewShowNote()
    } catch (error) {
      err(`[LLMServiceStep] Error in handleSelectLLM:`, error)
      if (error instanceof Error) {
        props.setError(error.message)
      } else {
        props.setError('An unknown error occurred.')
      }
    } finally {
      props.setIsLoading(false)
    }
  }
  l(`[LLMServiceStep] Rendering LLM service step, current service: ${props.llmService}`)
  return (
    <div className="space-y-6">
      {!Object.keys(L_CONFIG).length && (
        <p className="text-muted-foreground">No LLM config available</p>
      )}
      {allServices().length === 0 && (
        <p className="text-muted-foreground">No services found</p>
      )}
      {allServices().length > 0 && (
        <>
          <h2 className="h2">Select an LLM Model</h2>
          <div className="grid gap-6">
            {allServices().map(service => (
              <div key={service.value} className="bg-base-800 p-4 rounded-md">
                <h3 className="h3 text-primary-400 mb-4">{service.label}</h3>
                {(!service.models || service.models.length === 0) && (
                  <p className="text-muted-foreground">No models for {service.label}</p>
                )}
                <div className="grid gap-2">
                  {(service.models || []).map(m => {
                    const serviceCosts = props.llmCosts[service.value as string]
                    const modelCostData = Array.isArray(serviceCosts)
                      ? serviceCosts.find((x: LLMCostData) => x.modelId === m.modelId)
                      : null
                    const modelCost = modelCostData?.cost ?? 0
                    return (
                      <div key={m.modelId} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="llmChoice"
                          value={`${service.value}:${m.modelId}`}
                          checked={props.llmService === service.value && props.llmModel === m.modelId}
                          onChange={() => {
                            props.setLlmService(service.value as LLMServiceKey)
                            props.setLlmModel(m.modelId)
                          }}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <label className="text-sm font-medium">{m.modelName}</label>
                          <div className="text-sm text-muted-foreground">
                            {(modelCost * 1000).toFixed(1)} Credits (¢{(modelCost).toFixed(3)})
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="space-y-2">
        <label htmlFor="llmApiKey" className="block text-sm font-medium text-foreground">LLM API Key</label>
        <input
          type="password"
          id="llmApiKey"
          value={props.llmApiKey}
          onChange={e => props.setLlmApiKey(e.target.value)}
          className="form__input w-full py-2"
        />
      </div>
      <button 
        disabled={props.isLoading} 
        onClick={handleSelectLLM}
        className="button button--primary"
      >
        {props.isLoading ? 'Generating Show Notes...' : 'Generate Show Notes'}
      </button>
      {localResult && (
        <div className="space-y-4">
          <div>
            <h3 className="h3 mb-3">Show Note Result</h3>
            <pre className="bg-base-800 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(localResult.showNote, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="h3 mb-3">LLM Output Text</h3>
            <div className="bg-base-800 p-4 rounded-md whitespace-pre-wrap">
              {localResult.llmOutput}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}