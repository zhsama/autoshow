import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles with enhanced interaction feedback
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary-hover hover:shadow-md active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover hover:shadow-md active:scale-[0.98]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:scale-[0.95]',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary-hover',

        // Audio-specific variants
        'audio-play':
          'bg-audio-playing text-white shadow-sm hover:bg-audio-playing/90 hover:shadow-glow-sm active:scale-[0.95] transition-all duration-200',
        'audio-pause':
          'bg-audio-paused text-white shadow-sm hover:bg-audio-paused/90 active:scale-[0.95]',
        'audio-loading':
          'bg-audio-loading text-white shadow-sm animate-audio-pulse',
        'audio-error':
          'bg-audio-error text-white shadow-sm hover:bg-audio-error/90 active:scale-[0.95]',

        // Enhanced variants
        success:
          'bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md active:scale-[0.98]',
        warning:
          'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md active:scale-[0.98]',
        info: 'bg-info text-info-foreground shadow-sm hover:bg-info/90 hover:shadow-md active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-10 w-10',
        'icon-xl': 'h-12 w-12',

        // Audio-specific sizes
        'audio-control': 'h-12 w-12 rounded-full p-0',
        'audio-mini': 'h-8 w-8 rounded-full p-0',
        'audio-large': 'h-16 w-16 rounded-full p-0',
      },
      loading: {
        true: 'relative text-transparent',
        false: '',
      },
      rounded: {
        default: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
      rounded: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      rounded,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, loading, rounded, className })
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        {loading && loadingText ? loadingText : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

// Audio-specific button components with enhanced functionality
export const AudioPlayButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'size'>
>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="audio-play"
    size="audio-control"
    rounded="full"
    {...props}
  >
    {children}
  </Button>
))
AudioPlayButton.displayName = 'AudioPlayButton'

export const AudioPauseButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'size'>
>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="audio-pause"
    size="audio-control"
    rounded="full"
    {...props}
  >
    {children}
  </Button>
))
AudioPauseButton.displayName = 'AudioPauseButton'

export const AudioLoadingButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'size'>
>(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="audio-loading"
    size="audio-control"
    rounded="full"
    disabled
    {...props}
  >
    {children}
  </Button>
))
AudioLoadingButton.displayName = 'AudioLoadingButton'

export { Button, buttonVariants }
