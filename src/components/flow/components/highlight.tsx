import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'
import React from 'react'

export function Highlight({
  index,
  text,
  notch,
  className: highlightClassName,
}: {
  index?: number
  className?: ClassValue
  text: string
  notch?: string
}) {
  if (!text) {
    return ' '
  }
  return text.split('').map((s, k) => {
    let className: ClassValue = ''
    if (notch && notch.split('').includes(s)) {
      className = cn(className, 'bg-foreground text-background')
    }
    if (index != undefined && k === index) {
      className = cn(className, 'text-bold')
      className = cn(className, highlightClassName)
    }
    return (
      <span key={k} className={className}>
        {s}
      </span>
    )
  })
}
