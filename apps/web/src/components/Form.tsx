'use client'

import { useFormStore } from '@/stores/form-store'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { logger } from '@/lib/logger'
import { WalletStep } from './FormSteps/WalletStep'
import { ProcessTypeStep } from './FormSteps/ProcessTypeStep'
import { TranscriptionStep } from './FormSteps/TranscriptionStep'
import { LLMServiceStep } from './FormSteps/LLMServiceStep'
import type { FormProps } from '@autoshow/shared'

export default function Form(props: FormProps) {
  const { currentStep, error } = useFormStore()
  
  logger.log('[Form] Rendering Form for step:', currentStep)
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WalletStep />
      case 1:
        return <ProcessTypeStep />
      case 2:
        return <TranscriptionStep />
      case 3:
        return <LLMServiceStep onNewShowNote={props.onNewShowNote} />
      default:
        return null
    }
  }
  
  return (
    <Card className="max-w-full">
      {renderStep()}
      {error && (
        <Alert variant="destructive" className="m-6 mt-0">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}