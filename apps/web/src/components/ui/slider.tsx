'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange?: (value: number[]) => void
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      value || defaultValue
    )
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const isDragging = React.useRef(false)

    const currentValue = value !== undefined ? value : internalValue
    const percentage = ((currentValue[0] - min) / (max - min)) * 100

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      isDragging.current = true
      updateValue(e)
    }

    const updateValue = (e: React.MouseEvent | MouseEvent) => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = (e.clientX - rect.left) / rect.width
      const rawValue = min + percentage * (max - min)
      const steppedValue = Math.round(rawValue / step) * step
      const clampedValue = Math.min(Math.max(steppedValue, min), max)

      const newValue = [clampedValue]

      if (value === undefined) {
        setInternalValue(newValue)
      }

      onChange?.(newValue)
      onValueChange?.(newValue)
    }

    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
          updateValue(e)
        }
      }

      const handleMouseUp = () => {
        isDragging.current = false
      }

      if (isDragging.current) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <div
          ref={sliderRef}
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute h-full bg-primary transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 absolute"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
