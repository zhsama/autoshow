'use client'

import * as React from 'react'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Demo component to showcase audio-specific styling and animations
export function AudioDemo() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(35)

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setIsPlaying(true)
      }, 1500)
    }
  }

  const handleStop = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  return (
    <Card className="w-full max-w-md mx-auto theme-transition">
      <CardHeader>
        <CardTitle className="text-gradient">Audio Player Demo</CardTitle>
        <CardDescription>
          Showcasing enhanced theme system and audio-specific animations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Player */}
        <div className={`audio-player ${isPlaying ? 'playing' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Sample Audio Track</h3>
              <p className="text-sm text-muted-foreground">Demo Recording</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleStop}
                className="theme-transition"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="theme-transition"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="audio-progress mb-4">
            <div
              className="audio-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className={`btn-audio ${
                isLoading ? 'loading' : isPlaying ? 'playing' : 'paused'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </button>
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-sm text-muted-foreground mt-4">
            <span className="font-mono">1:23</span>
            <span className="font-mono">3:45</span>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Waveform Visualization</h4>
          <div className="waveform-container">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className={`waveform-bar ${
                  i < (24 * progress) / 100 ? 'active' : ''
                }`}
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status Indicators</h4>
          <div className="flex flex-wrap gap-2">
            <span className="status-indicator success">Recording Complete</span>
            <span className="status-indicator warning">Processing...</span>
            <span className="status-indicator error">Upload Failed</span>
            <span className="status-indicator info">Transcribing</span>
          </div>
        </div>

        {/* Button Variants */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Audio Button Variants</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="theme-transition">
              Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="theme-transition hover:audio-glow-sm"
            >
              Outline
            </Button>
            <Button variant="ghost" size="sm" className="theme-transition">
              Ghost
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="theme-transition audio-glow"
            >
              With Glow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Waveform component for reuse
export function WaveformVisualizer({
  progress = 0,
  bars = 20,
  className = '',
}: {
  progress?: number
  bars?: number
  className?: string
}) {
  return (
    <div className={`waveform-container ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className={`waveform-bar ${
            i < (bars * progress) / 100 ? 'active' : ''
          }`}
          style={{
            height: `${Math.random() * 80 + 20}%`,
          }}
        />
      ))}
    </div>
  )
}

// Status badge component
export function StatusBadge({
  status,
  children,
}: {
  status: 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}) {
  return <span className={`status-indicator ${status}`}>{children}</span>
}
