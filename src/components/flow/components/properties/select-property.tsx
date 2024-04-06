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
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'

type Props<T> = {
  label: string
  value: T
  setValue: (value: T) => void
  values: string[]
}
export function SelectProperty<T extends string>({
  label,
  value,
  setValue,
  values,
}: Props<T>) {
  return (
    <ModuleItemContainer className={'flex flex-row gap-2'}>
      <div
        className={'flex-0 text-center text-muted-foreground text-xs m-auto'}
      >
        {label}
      </div>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          {values.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ModuleItemContainer>
  )
}
