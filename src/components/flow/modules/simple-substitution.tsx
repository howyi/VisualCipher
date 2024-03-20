import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { Separator } from '@/components/ui/separator'
import { StringConnector } from '@/components/flow/components/string-connector'
import { ALPHABETS, UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import { Module, ModuleProcess } from '@/components/flow/modules/types'

export type SimpleSubstitutionData = {
  source?: string
  target?: string
}

export const SimpleSubstitutionProcess: ModuleProcess<
  SimpleSubstitutionData
> = (node, params, inputs) => {
  return SimpleSubstitutionEncrypt(
    inputs?.input ?? '',
    node.data.source ?? '',
    node.data.target ?? ''
  ).encrypted
}

export const SimpleSubstitutionModule: Module<SimpleSubstitutionData> = {
  type: 'simple_substitution',
  node: SimpleSubstitution,
  process: SimpleSubstitutionProcess,
  defaultData: {
    source: ALPHABETS,
    target: ALPHABETS.split('')
      .map(() => '-')
      .join(''),
  },
  name: 'Simple Substitution',
  description: 'simple string substitution',
  ports: {
    in: {
      input: {},
    },
    out: {
      output: {},
    },
  },
}

export function SimpleSubstitutionEncrypt(
  text: string,
  source: string,
  target: string
): {
  encrypted: string
} {
  const encrypted = text.replace(/[a-z]/gi, (letter) => {
    const index = source.indexOf(letter)
    if (index == -1) {
      return UNKNOWN_CHARACTER
    }
    return target[index] ?? UNKNOWN_CHARACTER
  })
  return {
    encrypted: encrypted,
  }
}

export function SimpleSubstitution({
  id,
  data: initialData,
}: NodeProps<SimpleSubstitutionData>) {
  const [data, setData] = useNodeDataState<SimpleSubstitutionData>(
    id,
    initialData
  )
  const [source, setSource] = useState(initialData.source ?? '')
  const [target, setTarget] = useState(initialData.target ?? '')
  const highLightIndex = useMemo(() => {
    if (!data.inputs?.input) {
      return undefined
    }
    const lastChar = (data.inputs.input ?? '').slice(-1)
    return source.indexOf(lastChar) == -1 ? undefined : source.indexOf(lastChar)
  }, [data.inputs])

  useEffect(() => {
    setData({
      source,
      target,
    })
  }, [source, target])

  return (
    <ModuleNode module={SimpleSubstitutionModule}>
      <div className={'flex flex-col gap-4 m-auto w-60 whitespace-pre'}>
        <div
          className={
            'flex flex-col m-auto gap-2 font-mono whitespace-pre w-60 text-center'
          }
        >
          <Input
            className={'text-sm px-1 w-full'}
            type="text"
            placeholder=" Board"
            value={source}
            onChange={(e) => {
              setSource(e.target.value)
            }}
          />
          <Input
            className={'text-sm px-1 w-full'}
            type="text"
            placeholder=" Board"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value)
            }}
          />
        </div>
        <Separator />
        <div className={'text-left flex flex-col mx-auto gap-1'}>
          <Label className={'text-muted-foreground'}>
            <Highlight
              index={highLightIndex}
              className={'text-module-input'}
              text={source}
              notch={''}
            />
          </Label>
          <Label>
            <StringConnector top={highLightIndex} bottom={highLightIndex} />
          </Label>
          <Label className={'text-muted-foreground'}>
            <Highlight
              index={highLightIndex}
              className={'text-module-output'}
              text={target}
              notch={''}
            />
          </Label>
        </div>
      </div>
    </ModuleNode>
  )
}
