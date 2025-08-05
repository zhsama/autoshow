import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface LinkProps {
  href: string
  children: React.ReactNode
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  prefetch?: boolean
  locale?: string
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
  [key: string]: any
}

export default function Link({ 
  href, 
  children, 
  replace, 
  className, 
  style, 
  onClick,
  ...props 
}: LinkProps) {
  // 处理外部链接
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  // 内部路由链接
  return (
    <RouterLink
      to={href}
      replace={replace}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </RouterLink>
  )
}