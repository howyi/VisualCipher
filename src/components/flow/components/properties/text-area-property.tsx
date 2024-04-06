import { Button } from '@/components/ui/button'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'
import { Textarea } from '@/components/ui/textarea'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

type Props = {
  label?: string
  value: string
  setValue: (value: string) => void
  onFocus?: () => void
  className?: ClassValue
}
export function TextAreaProperty({
  label,
  value,
  setValue,
  onFocus,
  className,
}: Props) {
  return (
    <ModuleItemContainer
      className={cn('h-full flex flex-col gap-2', className)}
    >
      {label && (
        <div
          className={'flex-0 text-center text-muted-foreground text-xs m-auto'}
        >
          {label}
        </div>
      )}
      <Textarea
        onFocus={onFocus}
        id="text"
        name="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={'nodrag'}
      />
    </ModuleItemContainer>
  )
}
