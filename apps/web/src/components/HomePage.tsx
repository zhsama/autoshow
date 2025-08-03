"use client"

import { useState } from "react"
import { Upload, Youtube, Plus, Link, Podcast } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useProcessTypeStep } from "@/hooks/use-form-steps"
import { logger } from "@/lib/logger"

export function HomePage() {
  const { toast } = useToast()
  
  // Use the existing form steps hook
  const {
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

  const handleProcessVideoUrl = async () => {
    logger.log('[HomePage] Processing video URL')
    setIsLoading(true)
    setError(null)
    setProcessType('video')
    
    try {
      // Create FormData for video URL
      const formData = new FormData()
      formData.append('type', 'video')
      formData.append('walletAddress', walletAddress || '')
      formData.append('url', url)
      
      // Download audio
      const response = await fetch('/api/download-audio', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process video')
      }
      
      const data = await response.json()
      setFinalPath(data.finalPath)
      setS3Url(data.s3Url)
      setFrontMatter(data.frontMatter)
      setMetadata(data.metadata)
      setTranscriptionCosts(data.transcriptionCost)
      setShowNoteId(data.id)
      
      logger.log('[HomePage] Video processed successfully')
      
      toast({
        title: "Import successful",
        description: "Video has been processed and is ready for transcription.",
      })
      
      // Navigate to transcription step
      setCurrentStep(2)
    } catch (error) {
      logger.error('[HomePage] Error processing video:', error)
      setError(error instanceof Error ? error.message : 'Failed to process video')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to process video',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessFile = async () => {
    logger.log('[HomePage] Processing file')
    setIsLoading(true)
    setError(null)
    setProcessType('file')
    
    try {
      if (!selectedFile) {
        throw new Error('Please select a file')
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('type', 'file')
      formData.append('walletAddress', walletAddress || '')
      formData.append('file', selectedFile)
      
      // Process file
      const response = await fetch('/api/download-audio', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process file')
      }
      
      const data = await response.json()
      setFinalPath(data.finalPath)
      setS3Url(data.s3Url)
      setFrontMatter(data.frontMatter)
      setMetadata(data.metadata)
      setTranscriptionCosts(data.transcriptionCost)
      setShowNoteId(data.id)
      
      logger.log('[HomePage] File processed successfully')
      
      toast({
        title: "Import successful",
        description: "File has been processed and is ready for transcription.",
      })
      
      // Navigate to transcription step
      setCurrentStep(2)
    } catch (error) {
      logger.error('[HomePage] Error processing file:', error)
      setError(error instanceof Error ? error.message : 'Failed to process file')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: "destructive",
      })
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event)
    const files = event.target.files
    if (!files || files.length === 0) return

    toast({
      title: "File selected",
      description: `Selected: ${files[0].name}`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Import Media</h1>
        <p className="text-muted-foreground">
          Add YouTube videos, podcasts, or local files to your media library
        </p>
      </div>

      {/* Universal Import Card */}
      <Card className="shadow-elevation-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Import Content
          </CardTitle>
          <CardDescription>
            Enter a YouTube URL, podcast RSS feed, or upload local files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="content-url">URL or Link</Label>
            <div className="flex gap-2">
              <Input
                id="content-url"
                placeholder="https://www.youtube.com/watch?v=... or https://feeds.example.com/podcast.xml"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleProcessVideoUrl}
                disabled={isLoading || !url}
                className="min-w-24"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? 'Processing...' : 'Import'}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Youtube className="h-3 w-3" />
                YouTube
              </div>
              <div className="flex items-center gap-1">
                <Podcast className="h-3 w-3" />
                Podcasts
              </div>
              <div className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                RSS Feeds
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-base font-medium">Drop files here or click to browse</p>
              <p className="text-sm text-muted-foreground">
                Supports: MP4, MP3, WAV, MOV, AVI (Max 100MB each)
              </p>
            </div>
            <Input
              type="file"
              multiple
              accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a,.aac,.ogg,.flac,.mkv,.avi,.mov,.webm"
              onChange={handleFileUpload}
              className="mt-3 cursor-pointer"
            />
            {selectedFile && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <Button 
                  onClick={handleProcessFile}
                  disabled={isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? 'Processing...' : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Process File
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}