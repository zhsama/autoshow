import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'text-foreground border-border bg-background hover:bg-accent',

        // Status variants
        success:
          'border-transparent bg-success/10 text-success border border-success/20 hover:bg-success/20',
        warning:
          'border-transparent bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20',
        error:
          'border-transparent bg-error/10 text-error border border-error/20 hover:bg-error/20',
        info: 'border-transparent bg-info/10 text-info border border-info/20 hover:bg-info/20',

        // Audio-specific variants with enhanced visual feedback
        'audio-playing':
          'border-transparent bg-audio-playing/10 text-audio-playing border border-audio-playing/20 hover:bg-audio-playing/20 animate-audio-pulse shadow-glow-sm',
        'audio-paused':
          'border-transparent bg-audio-paused/10 text-audio-paused border border-audio-paused/20 hover:bg-audio-paused/20',
        'audio-loading':
          'border-transparent bg-audio-loading/10 text-audio-loading border border-audio-loading/20 hover:bg-audio-loading/20 animate-pulse',
        'audio-error':
          'border-transparent bg-audio-error/10 text-audio-error border border-audio-error/20 hover:bg-audio-error/20',
        'audio-processing':
          'border-transparent bg-audio-waveform/10 text-audio-waveform border border-audio-waveform/20 hover:bg-audio-waveform/20',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-2xs',
        lg: 'px-3 py-1 text-sm',
        icon: 'h-6 w-6 p-0',
      },
      rounded: {
        default: 'rounded-full',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Whether the badge should have a pulsing animation
   */
  pulse?: boolean
  /**
   * Custom icon to display in the badge
   */
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      pulse = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, rounded }),
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="mr-1 h-3 w-3 flex items-center justify-center">
            {icon}
          </span>
        )}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

// Audio-specific badge components for common audio states
export const AudioStatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'playing' | 'paused' | 'loading' | 'error' | 'processing'
  }
>(({ status, children, ...props }, ref) => {
  const variantMap = {
    playing: 'audio-playing' as const,
    paused: 'audio-paused' as const,
    loading: 'audio-loading' as const,
    error: 'audio-error' as const,
    processing: 'audio-processing' as const,
  }

  const statusText = {
    playing: 'Playing',
    paused: 'Paused',
    loading: 'Loading',
    error: 'Error',
    processing: 'Processing',
  }

  return (
    <Badge ref={ref} variant={variantMap[status]} {...props}>
      {children || statusText[status]}
    </Badge>
  )
})
AudioStatusBadge.displayName = 'AudioStatusBadge'

export const TranscriptionStatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'pending' | 'processing' | 'completed' | 'failed'
  }
>(({ status, children, ...props }, ref) => {
  const variantMap = {
    pending: 'warning' as const,
    processing: 'audio-loading' as const,
    completed: 'success' as const,
    failed: 'error' as const,
  }

  const statusText = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  }

  return (
    <Badge
      ref={ref}
      variant={variantMap[status]}
      pulse={status === 'processing'}
      {...props}
    >
      {children || statusText[status]}
    </Badge>
  )
})
TranscriptionStatusBadge.displayName = 'TranscriptionStatusBadge'

export { Badge, badgeVariants }
