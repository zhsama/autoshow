import React from 'react'

interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
  [key: string]: any
}

export default function Image({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  style,
  onLoad,
  onError,
  ...props 
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}