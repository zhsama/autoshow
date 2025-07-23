'use client'

import { useState } from 'react'
import { WalletStep } from './groups/Wallet'
import { ProcessTypeStep } from './groups/ProcessType'
import { TranscriptionStep } from './groups/TranscriptionService'
import { LLMServiceStep } from './groups/LLMService'
import type { AlertProps, FormProps, ProcessTypeEnum, LLMServiceKey, ShowNoteMetadata, TranscriptionCosts } from '@autoshow/shared'

const l = console.log

export const Alert = (props: AlertProps) => {
  l(`[Alert] Displaying alert with variant: ${props.variant}, message: ${props.message}`)
  return (
    <div className={`alert ${props.variant === 'error' ? 'bg-error text-error-foreground' : 'bg-info text-info-foreground'} p-4 rounded-md my-4`}>
      <p>{props.message}</p>
    </div>
  )
}

export default function Form(props: FormProps) {
  const pre = '[Form]'
  const [currentStep, setCurrentStep] = useState(1)
  l(`${pre} Initial currentStep: ${currentStep}`)
  
  const [walletAddress, setWalletAddress] = useState('yhGfbjKDuTnJyx8wzje7n9wsoWC51WH7Y5')
  l(`${pre} Initial walletAddress: ${walletAddress}`)
  
  const [mnemonic, setMnemonic] = useState('tip punch promote click scheme guitar skirt lucky hamster clip denial ecology')
  l(`${pre} Initial mnemonic set (redacted)`)
  
  const [processType, setProcessType] = useState<ProcessTypeEnum>('video')
  l(`${pre} Initial processType: ${processType}`)
  
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=MORMZXEaONk')
  l(`${pre} Initial url: ${url}`)
  
  const [filePath, setFilePath] = useState('autoshow/content/examples/audio.mp3')
  l(`${pre} Initial filePath: ${filePath}`)
  
  const [finalPath, setFinalPath] = useState('')
  l(`${pre} Initial finalPath: ${finalPath}`)
  
  const [s3Url, setS3Url] = useState('')
  l(`${pre} Initial s3Url: ${s3Url}`)
  
  const [metadata, setMetadata] = useState<Partial<ShowNoteMetadata>>({})
  l(`${pre} Initial metadata: {}`)
  
  const [frontMatter, setFrontMatter] = useState('')
  l(`${pre} Initial frontMatter: ""`)
  
  const [transcriptionService, setTranscriptionService] = useState('deepgram')
  l(`${pre} Initial transcriptionService: ${transcriptionService}`)
  
  const [transcriptionModel, setTranscriptionModel] = useState('nova-2')
  l(`${pre} Initial transcriptionModel: ${transcriptionModel}`)
  
  const [transcriptionModelUsed, setTranscriptionModelUsed] = useState('')
  l(`${pre} Initial transcriptionModelUsed: ""`)
  
  const [transcriptionApiKey, setTranscriptionApiKey] = useState('')
  l(`${pre} Initial transcriptionApiKey set (empty)`)
  
  const [transcriptionCosts, setTranscriptionCosts] = useState<TranscriptionCosts>({})
  l(`${pre} Initial transcriptionCosts: {}`)
  
  const [transcriptionCostUsed, setTranscriptionCostUsed] = useState<number | null>(null)
  l(`${pre} Initial transcriptionCostUsed: null`)
  
  const [transcriptContent, setTranscriptContent] = useState('')
  l(`${pre} Initial transcriptContent: ""`)
  
  const [selectedPrompts, setSelectedPrompts] = useState(['shortSummary'])
  l(`${pre} Initial selectedPrompts: ${selectedPrompts.join(', ')}`)
  
  const [promptText, setPromptText] = useState('')
  l(`${pre} Initial promptText: ""`)
  
  const [llmService, setLlmService] = useState<LLMServiceKey>('chatgpt')
  l(`${pre} Initial llmService: ${llmService}`)
  
  const [llmModel, setLlmModel] = useState('gpt-4o-mini')
  l(`${pre} Initial llmModel: ${llmModel}`)
  
  const [llmApiKey, setLlmApiKey] = useState('')
  l(`${pre} Initial llmApiKey set (empty)`)
  
  interface LLMCostData {
    modelId: string
    cost: number
  }
  
  const [llmCosts, setLlmCosts] = useState<Record<string, LLMCostData[]>>({})
  l(`${pre} Initial llmCosts: {}`)
  
  const [error, setError] = useState<string | null>(null)
  l(`${pre} Initial error: null`)
  
  const [isLoading, setIsLoading] = useState(false)
  l(`${pre} Initial isLoading: false`)
  
  const [dashBalance, setDashBalance] = useState<number | null>(null)
  l(`${pre} Initial dashBalance: null`)
  
  const [showNoteId, setShowNoteId] = useState<number>(0)
  l(`${pre} Initial showNoteId: 0`)
  
  l(`${pre} Rendering Form for step: ${currentStep}`)
  
  return (
    <div className="max-w-full bg-card rounded-lg p-6 mb-8">
      {currentStep === 0 && (
        <WalletStep
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          mnemonic={mnemonic}
          setMnemonic={setMnemonic}
          dashBalance={dashBalance}
          setDashBalance={setDashBalance}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 1 && (
        <ProcessTypeStep
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          processType={processType}
          setProcessType={setProcessType}
          url={url}
          setUrl={setUrl}
          filePath={filePath}
          setFilePath={setFilePath}
          setFinalPath={setFinalPath}
          setS3Url={setS3Url}
          setFrontMatter={setFrontMatter}
          setMetadata={setMetadata}
          setTranscriptionCosts={setTranscriptionCosts}
          setCurrentStep={setCurrentStep}
          setShowNoteId={setShowNoteId}
        />
      )}
      {currentStep === 2 && (
        <TranscriptionStep
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          transcriptionService={transcriptionService}
          setTranscriptionService={setTranscriptionService}
          transcriptionModel={transcriptionModel}
          setTranscriptionModel={setTranscriptionModel}
          transcriptionApiKey={transcriptionApiKey}
          setTranscriptionApiKey={setTranscriptionApiKey}
          finalPath={finalPath}
          s3Url={s3Url}
          setTranscriptContent={setTranscriptContent}
          setTranscriptionModelUsed={setTranscriptionModelUsed}
          setTranscriptionCostUsed={setTranscriptionCostUsed}
          transcriptionCosts={transcriptionCosts}
          selectedPrompts={selectedPrompts}
          setSelectedPrompts={setSelectedPrompts}
          setLlmCosts={setLlmCosts}
          setPromptText={setPromptText}
          setCurrentStep={setCurrentStep}
          showNoteId={showNoteId}
        />
      )}
      {currentStep === 3 && (
        <LLMServiceStep
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          llmService={llmService}
          setLlmService={setLlmService}
          llmModel={llmModel}
          setLlmModel={setLlmModel}
          llmApiKey={llmApiKey}
          setLlmApiKey={setLlmApiKey}
          frontMatter={frontMatter}
          promptText={promptText}
          transcript={transcriptContent}
          transcriptionService={transcriptionService}
          transcriptionModelUsed={transcriptionModelUsed}
          transcriptionCostUsed={transcriptionCostUsed}
          metadata={metadata}
          onNewShowNote={props.onNewShowNote}
          llmCosts={llmCosts}
          showNoteId={showNoteId}
        />
      )}
      {error && <Alert message={error} variant="error" />}
    </div>
  )
}