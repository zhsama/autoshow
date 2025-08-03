import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md',
        elevated: 'shadow-md hover:shadow-lg',
        outline: 'border-border bg-background',
        ghost: 'border-transparent bg-transparent shadow-none',

        // Audio-specific variants
        'audio-player':
          'shadow-player border-border/50 hover:shadow-lg hover:shadow-primary/10',
        'audio-card':
          'shadow-sm hover:shadow-md border-audio-waveform/20 bg-gradient-to-br from-background to-accent/20',
        interactive:
          'shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer active:scale-[0.99]',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        xl: 'p-12',
        none: 'p-0',
      },
      rounded: {
        default: 'rounded-lg',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
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

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card should be clickable
   */
  clickable?: boolean
  /**
   * Loading state for the card
   */
  loading?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      clickable,
      loading,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant: clickable && !variant ? 'interactive' : variant,
            size,
            rounded,
          }),
          loading && 'animate-pulse opacity-70',
          clickable && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'flex flex-col space-y-1.5 p-6',
    sm: 'flex flex-col space-y-1.5 p-4',
    lg: 'flex flex-col space-y-1.5 p-8',
  }

  return (
    <div ref={ref} className={cn(sizeClasses[size], className)} {...props} />
  )
})
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    size?: 'default' | 'sm' | 'lg' | 'xl'
  }
>(({ className, as: Comp = 'h3', size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'text-lg font-semibold leading-none tracking-tight',
    sm: 'text-base font-semibold leading-none tracking-tight',
    lg: 'text-xl font-semibold leading-none tracking-tight',
    xl: 'text-2xl font-bold leading-none tracking-tight',
  }

  return (
    <Comp ref={ref} className={cn(sizeClasses[size], className)} {...props} />
  )
})
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'text-sm text-muted-foreground',
    sm: 'text-xs text-muted-foreground',
    lg: 'text-base text-muted-foreground',
  }

  return <p ref={ref} className={cn(sizeClasses[size], className)} {...props} />
})
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'default' | 'sm' | 'lg' | 'none'
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'p-6 pt-0',
    sm: 'p-4 pt-0 text-sm',
    lg: 'p-8 pt-0 text-base',
    none: 'pt-0 p-0',
  }

  return (
    <div ref={ref} className={cn(sizeClasses[size], className)} {...props} />
  )
})
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    default: 'flex items-center p-6 pt-0',
    sm: 'flex items-center p-4 pt-0',
    lg: 'flex items-center p-8 pt-0',
  }

  return (
    <div ref={ref} className={cn(sizeClasses[size], className)} {...props} />
  )
})
CardFooter.displayName = 'CardFooter'

// Audio-specific card components
export const AudioPlayerCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'>
>(({ children, ...props }, ref) => (
  <Card ref={ref} variant="audio-player" {...props}>
    {children}
  </Card>
))
AudioPlayerCard.displayName = 'AudioPlayerCard'

export const AudioFileCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'> & {
    duration?: string
    fileSize?: string
    status?: 'processing' | 'completed' | 'error'
  }
>(({ children, duration, fileSize, status, ...props }, ref) => (
  <Card
    ref={ref}
    variant="audio-card"
    clickable={status === 'completed'}
    {...props}
  >
    {children}
    {(duration || fileSize || status) && (
      <CardFooter
        size="sm"
        className="justify-between text-xs text-muted-foreground"
      >
        <div className="flex gap-2">
          {duration && <span>{duration}</span>}
          {fileSize && <span>{fileSize}</span>}
        </div>
        {status && (
          <span
            className={cn(
              'font-medium',
              status === 'completed' && 'text-success',
              status === 'processing' && 'text-warning',
              status === 'error' && 'text-error'
            )}
          >
            {status}
          </span>
        )}
      </CardFooter>
    )}
  </Card>
))
AudioFileCard.displayName = 'AudioFileCard'

export const TranscriptCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'> & {
    timestamp?: string
    confidence?: number
    speaker?: string
  }
>(({ children, timestamp, confidence, speaker, ...props }, ref) => (
  <Card ref={ref} variant="outline" clickable {...props}>
    {(timestamp || speaker) && (
      <CardHeader size="sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {speaker && (
              <span className="font-medium text-foreground">{speaker}</span>
            )}
            {timestamp && <span className="font-mono">{timestamp}</span>}
          </div>
          {confidence && (
            <span
              className={cn(
                'font-medium',
                confidence > 0.8 && 'text-success',
                confidence > 0.6 && confidence <= 0.8 && 'text-warning',
                confidence <= 0.6 && 'text-error'
              )}
            >
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </CardHeader>
    )}
    <CardContent size="sm">{children}</CardContent>
  </Card>
))
TranscriptCard.displayName = 'TranscriptCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}
