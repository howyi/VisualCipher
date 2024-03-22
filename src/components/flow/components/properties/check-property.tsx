import { Button } from '@/components/ui/button'
import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useBoolean } from 'usehooks-ts'

type Props = {
  label: string
  value: ReturnType<typeof useBoolean>
}
export function CheckProperty({ label, value }: Props) {
  return (
    <div className="flex items-center mx-auto space-x-2">
      <Checkbox
        checked={value.value}
        id="reverse"
        onCheckedChange={value.toggle}
      />
      <Label
        htmlFor="reverse"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
    </div>
  )
}
