'use client'

import { PROCESS_TYPES } from '@autoshow/shared'
import type { ProcessTypeEnum, ShowNoteMetadata, TranscriptionCosts } from '@autoshow/shared'

const l = console.log
const err = console.error

interface ProcessTypeStepProps {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  setError: (value: string | null) => void
  processType: ProcessTypeEnum
  setProcessType: (value: ProcessTypeEnum) => void
  url: string
  setUrl: (value: string) => void
  filePath: string
  setFilePath: (value: string) => void
  setFinalPath: (value: string) => void
  setS3Url: (value: string) => void
  setFrontMatter: (value: string) => void
  setMetadata: (value: Partial<ShowNoteMetadata>) => void
  setTranscriptionCosts: (value: TranscriptionCosts) => void
  setCurrentStep: (value: number) => void
  setShowNoteId: (value: number) => void
}

export const ProcessTypeStep = (props: ProcessTypeStepProps) => {
  const handleStepOne = async (): Promise<void> => {
    l(`[ProcessTypeStep] Starting audio processing for ${props.processType} type`)
    props.setIsLoading(true)
    props.setError(null)
    props.setTranscriptionCosts({})
    try {
      interface DownloadAudioBody {
        type: string
        url?: string
        filePath?: string
        options: {
          video?: string
          filePath?: string
          file?: string
        }
      }
      
      const body: DownloadAudioBody = { type: props.processType, options: {} }
      if (props.processType === 'video') {
        body.url = props.url
        body.options.video = props.url
      } else {
        body.filePath = props.filePath
        body.options.file = props.filePath
      }
      l(`[ProcessTypeStep] Sending download-audio request for ${props.processType}`)
      const res = await fetch('http://localhost:4321/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const errorData = await res.json()
        err(`[ProcessTypeStep] Download audio error:`, errorData)
        throw new Error(`Error downloading audio: ${errorData.error || res.statusText}`)
      }
      const resData = await res.json()
      props.setFrontMatter(resData.frontMatter || '')
      props.setMetadata(resData.metadata || {})
      props.setFinalPath(resData.finalPath || '')
      props.setS3Url(resData.s3Url || '')
      props.setShowNoteId(resData.id)
      if (resData.transcriptionCost) {
        props.setTranscriptionCosts(resData.transcriptionCost)
      } else {
        console.warn(`[ProcessTypeStep] No transcriptionCost found in response`)
      }
      l(`[ProcessTypeStep] Successfully processed ${props.processType}, received showNoteId: ${resData.id}, moving to step 2`)
      props.setCurrentStep(2)
    } catch (error) {
      err(`[ProcessTypeStep] Error in handleStepOne:`, error)
      if (error instanceof Error) {
        props.setError(error.message)
      } else {
        props.setError('An unknown error occurred.')
      }
    } finally {
      props.setIsLoading(false)
    }
  }
  l(`[ProcessTypeStep] Rendering process type step for: ${props.processType}`)
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="processType" className="block text-sm font-medium text-foreground">Process Type</label>
        <select
          id="processType"
          value={props.processType}
          onChange={e => {
            const value = e.target.value as ProcessTypeEnum
            props.setProcessType(value)
          }}
          className="form__input w-full py-2"
        >
          {PROCESS_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      {props.processType === 'video' && (
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-foreground">
            YouTube URL
          </label>
          <input
            type="text"
            id="url"
            value={props.url}
            onChange={e => props.setUrl(e.target.value)}
            className="form__input w-full py-2"
            required
          />
        </div>
      )}
      {props.processType === 'file' && (
        <div className="space-y-2">
          <label htmlFor="filePath" className="block text-sm font-medium text-foreground">File Path</label>
          <input
            type="text"
            id="filePath"
            value={props.filePath}
            onChange={e => props.setFilePath(e.target.value)}
            className="form__input w-full py-2"
            required
          />
        </div>
      )}
      <button 
        disabled={props.isLoading} 
        onClick={handleStepOne}
        className="button button--primary"
      >
        {props.isLoading ? 'Processing...' : 'Start Processing & Calculate Costs'}
      </button>
    </div>
  )
}