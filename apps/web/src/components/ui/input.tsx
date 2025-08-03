import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-input focus-visible:border-primary hover:border-primary/70',
        success:
          'border-success focus-visible:border-success focus-visible:ring-success',
        warning:
          'border-warning focus-visible:border-warning focus-visible:ring-warning',
        error:
          'border-error focus-visible:border-error focus-visible:ring-error',
        ghost: 'border-transparent bg-transparent shadow-none',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2.5 py-1.5 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
        xl: 'h-14 px-5 py-4 text-lg',
      },
      rounded: {
        default: 'rounded-md',
        sm: 'rounded-sm',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
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

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /**
   * Icon to display on the left side of the input
   */
  leftIcon?: React.ReactNode
  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: React.ReactNode
  /**
   * Whether the input is in a loading state
   */
  loading?: boolean
  /**
   * Error message to display
   */
  error?: string
  /**
   * Success message to display
   */
  success?: string
  /**
   * Helper text to display below the input
   */
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      type = 'text',
      leftIcon,
      rightIcon,
      loading,
      error,
      success,
      helperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIcon = leftIcon || rightIcon || loading
    const actualVariant = error ? 'error' : success ? 'success' : variant

    const inputElement = (
      <input
        type={type}
        className={cn(
          inputVariants({ variant: actualVariant, size, rounded }),
          hasIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      />
    )

    if (!hasIcon) {
      return (
        <div className="space-y-2">
          {inputElement}
          {(error || success || helperText) && (
            <div className="text-sm">
              {error && <p className="text-error">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {helperText && !error && !success && (
                <p className="text-muted-foreground">{helperText}</p>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          {inputElement}
          {(rightIcon || loading) && (
            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {(error || success || helperText) && (
          <div className="text-sm">
            {error && <p className="text-error">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            {helperText && !error && !success && (
              <p className="text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Audio-specific input components
export const AudioTimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(({ placeholder = '00:00:00', className, ...props }, ref) => (
  <Input
    ref={ref}
    type="text"
    placeholder={placeholder}
    className={cn('font-mono text-center', className)}
    {...props}
  />
))
AudioTimeInput.displayName = 'AudioTimeInput'

export const VolumeInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'> & {
    min?: number
    max?: number
    step?: number
  }
>(({ min = 0, max = 100, step = 1, className, ...props }, ref) => (
  <Input
    ref={ref}
    type="range"
    min={min}
    max={max}
    step={step}
    className={cn('audio-range', className)}
    {...props}
  />
))
VolumeInput.displayName = 'VolumeInput'

export const ProgressInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'> & {
    min?: number
    max?: number
    step?: number
    duration?: number
  }
>(({ min = 0, max = 100, step = 0.1, duration, className, ...props }, ref) => (
  <Input
    ref={ref}
    type="range"
    min={min}
    max={duration || max}
    step={step}
    className={cn('progress-bar', className)}
    {...props}
  />
))
ProgressInput.displayName = 'ProgressInput'

// Label component for forms
export const Label = React.forwardRef<
  React.ElementRef<'label'>,
  React.ComponentPropsWithoutRef<'label'> & {
    required?: boolean
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, required, size = 'default', children, ...props }, ref) => {
  const sizeClasses = {
    default: 'text-sm font-medium',
    sm: 'text-xs font-medium',
    lg: 'text-base font-medium',
  }

  return (
    <label
      ref={ref}
      className={cn(
        sizeClasses[size],
        'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-error">*</span>}
    </label>
  )
})
Label.displayName = 'Label'

// Form group component for better organization
export const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    required?: boolean
    error?: string
    success?: string
    helperText?: string
    size?: 'default' | 'sm' | 'lg'
  }
>(
  (
    {
      className,
      label,
      required,
      error,
      success,
      helperText,
      size = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <Label required={required} size={size}>
            {label}
          </Label>
        )}
        {children}
        {(error || success || helperText) && (
          <div className="text-sm">
            {error && <p className="text-error">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            {helperText && !error && !success && (
              <p className="text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
FormGroup.displayName = 'FormGroup'

export { Input, inputVariants }
