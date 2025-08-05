'use client'

import * as React from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Download,
  Share,
  MoreHorizontal,
  Minimize2,
  Maximize2,
  Clock,
  FileAudio,
  Mic,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Button,
  AudioPlayButton,
  AudioPauseButton,
} from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerPanelProps {
  className?: string
  isMobile?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface AudioFile {
  id: string
  title: string
  artist?: string
  duration: number
  currentTime: number
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  hasError: boolean
  fileType: string
  transcriptionStatus?: 'pending' | 'processing' | 'completed' | 'failed'
}

// Mock audio data - would come from state management
const mockAudioFile: AudioFile = {
  id: '1',
  title: 'Meeting Recording - Jan 15th',
  artist: 'Business Meeting',
  duration: 3480, // 58 minutes
  currentTime: 1234, // 20:34
  isPlaying: false,
  isPaused: true,
  isLoading: false,
  hasError: false,
  fileType: 'mp3',
  transcriptionStatus: 'completed',
}

export function AudioPlayerPanel({
  className,
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse,
}: AudioPlayerPanelProps) {
  const [audioFile, setAudioFile] = React.useState<AudioFile>(mockAudioFile)
  const [volume, setVolume] = React.useState([75])
  const [isMuted, setIsMuted] = React.useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (audioFile.currentTime / audioFile.duration) * 100

  // Mobile layout - bottom sticky
  if (isMobile) {
    return (
      <div
        className={cn(
          'sticky bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90',
          className
        )}
      >
        <div className="px-4 py-3">
          {/* Progress Bar */}
          <div className="mb-3">
            <Progress value={progressPercentage} className="h-1 bg-muted" />
          </div>

          {/* Mobile Player Controls */}
          <div className="flex items-center justify-between">
            {/* Audio Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileAudio className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {audioFile.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(audioFile.currentTime)} /{' '}
                  {formatTime(audioFile.duration)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm">
                <SkipBack className="h-4 w-4" />
              </Button>

              {audioFile.isPlaying ? (
                <AudioPauseButton size="audio-mini">
                  <Pause className="h-4 w-4" />
                </AudioPauseButton>
              ) : (
                <AudioPlayButton size="audio-mini">
                  <Play className="h-4 w-4" />
                </AudioPlayButton>
              )}

              <Button variant="ghost" size="icon-sm">
                <SkipForward className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout - side panel
  return (
    <div
      className={cn(
        'h-full flex flex-col',
        isCollapsed && 'hidden xl:flex',
        className
      )}
    >
      <Card className="flex-1 m-4 flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mic className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium">Audio Player</h3>
            </div>

            {onToggleCollapse && (
              <Button variant="ghost" size="icon-sm" onClick={onToggleCollapse}>
                {isCollapsed ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 flex flex-col">
          {/* Audio File Info */}
          <div className="mb-6">
            <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
              <FileAudio className="h-16 w-16 text-primary" />
            </div>

            <div className="text-center mb-2">
              <h4 className="font-medium text-base mb-1">{audioFile.title}</h4>
              {audioFile.artist && (
                <p className="text-sm text-muted-foreground">
                  {audioFile.artist}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
              <Badge
                variant={
                  audioFile.transcriptionStatus === 'completed'
                    ? 'success'
                    : 'secondary'
                }
                className="gap-1"
              >
                <Clock className="h-3 w-3" />
                {audioFile.transcriptionStatus === 'completed'
                  ? 'Transcribed'
                  : 'Processing'}
              </Badge>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <Progress
              value={progressPercentage}
              className="h-2 mb-2 bg-muted"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{formatTime(audioFile.currentTime)}</span>
              <span>{formatTime(audioFile.duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon">
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon-lg">
              <SkipBack className="h-5 w-5" />
            </Button>

            {audioFile.isPlaying ? (
              <AudioPauseButton size="audio-control">
                <Pause className="h-6 w-6" />
              </AudioPauseButton>
            ) : (
              <AudioPlayButton size="audio-control">
                <Play className="h-6 w-6" />
              </AudioPlayButton>
            )}

            <Button variant="ghost" size="icon-lg">
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />

              <span className="text-xs text-muted-foreground font-mono w-8">
                {isMuted ? 0 : volume[0]}%
              </span>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-auto space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Share className="mr-2 h-4 w-4" />
              Share File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Compact version for smaller spaces
export function CompactAudioPlayer({ className }: { className?: string }) {
  const [audioFile] = React.useState<AudioFile>(mockAudioFile)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (audioFile.currentTime / audioFile.duration) * 100

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-4">
        {/* Audio Icon */}
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileAudio className="h-6 w-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm truncate">{audioFile.title}</h4>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm">
                <SkipBack className="h-3 w-3" />
              </Button>

              {audioFile.isPlaying ? (
                <AudioPauseButton size="audio-mini">
                  <Pause className="h-3 w-3" />
                </AudioPauseButton>
              ) : (
                <AudioPlayButton size="audio-mini">
                  <Play className="h-3 w-3" />
                </AudioPlayButton>
              )}

              <Button variant="ghost" size="icon-sm">
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-1 mb-1" />

          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{formatTime(audioFile.currentTime)}</span>
            <span>{formatTime(audioFile.duration)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
