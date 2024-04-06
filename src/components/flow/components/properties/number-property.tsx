import { Button } from '@/components/ui/button'
import React from 'react'
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'

type Props = {
  label: string
  value: number
  min?: number
  max?: number
  unit?: number
  setValue: (value: number) => void
}
export function NumberProperty({
  label,
  value,
  setValue,
  min,
  max,
  unit = 1,
}: Props) {
  const up = () => {
    setValue(value + unit)
  }
  const down = () => {
    setValue(value - unit)
  }
  return (
    <ModuleItemContainer className={'flex flex-row gap-2'}>
      <Button
        size={'xs'}
        disabled={min != undefined ? min > value - unit : false}
        onClick={down}
        className={'flex-0 w-12'}
        variant="outline"
      >
        ←
      </Button>
      <div
        className={'flex-1 text-center text-muted-foreground text-xs m-auto'}
      >
        {label}: {value}
      </div>
      <Button
        size={'xs'}
        disabled={max ? max < value + unit : false}
        onClick={up}
        className={'flex-0 w-12'}
        variant="outline"
      >
        →
      </Button>
    </ModuleItemContainer>
  )
}
