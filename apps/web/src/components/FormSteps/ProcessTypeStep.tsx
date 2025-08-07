'use client'

import { useState } from 'react'
import { useProcessTypeStep } from '@/hooks/use-form-steps'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { logger } from '@/lib/logger'
import { PROCESS_TYPES } from '@autoshow/shared'

export function ProcessTypeStep() {
  const {
    processType,
    url,
    isLoading,
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
  } = useProcessTypeStep()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleNext = async () => {
    logger.log('[ProcessTypeStep] Processing media')
    setIsLoading(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('type', processType)
      formData.append('walletAddress', walletAddress || '')

      if (processType === 'video') {
        formData.append('url', url)
      } else {
        if (!selectedFile) {
          throw new Error('Please select a file')
        }
        formData.append('file', selectedFile)
      }

      // Download audio or process file
      const response = await fetch('/api/download-audio', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process media')
      }

      const data = await response.json()
      setFinalPath(data.finalPath)
      setS3Url(data.s3Url)
      setFrontMatter(data.frontMatter)
      setMetadata(data.metadata)
      setTranscriptionCosts(data.transcriptionCost)
      setShowNoteId(data.id)

      logger.log('[ProcessTypeStep] Media processed successfully')
      setCurrentStep(2)
    } catch (error) {
      logger.error('[ProcessTypeStep] Error processing media:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to process media'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFilePath(file.name)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Select Input Type</CardTitle>
        <CardDescription>
          Choose whether to process a video URL or upload an audio/video file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Process Type</Label>
          <RadioGroup
            value={processType}
            onValueChange={value => setProcessType(value as 'video' | 'file')}
          >
            {PROCESS_TYPES.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem value={type.value} id={type.value} />
                <Label htmlFor={type.value} className="cursor-pointer">
                  {type.label === 'Video' ? 'Video URL' : 'Upload File'}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {processType === 'video' ? (
          <div className="space-y-2">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Audio/Video File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a,.aac,.ogg,.flac,.mkv,.avi,.mov,.webm"
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            isLoading || (processType === 'video' ? !url : !selectedFile)
          }
        >
          {isLoading ? 'Processing...' : 'Next'}
        </Button>
      </CardFooter>
    </>
  )
}
