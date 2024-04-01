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

type Props = {
  label: string
  value: string
  setValue: (value: string) => void
}
export function StringProperty({ label, value, setValue }: Props) {
  return (
    <div className={'flex flex-row gap-2'}>
      <div
        className={'flex-0 text-center text-muted-foreground text-xs m-auto'}
      >
        {label}
      </div>
      <Input
        className={'flex-1'}
        id="text"
        name="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
