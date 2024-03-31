import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { Separator } from '@/components/ui/separator'
import { StringConnector } from '@/components/flow/components/string-connector'
import { ALPHABETS, UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {
  source?: string
  target?: string
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>
export const SimpleSubstitutionModule: Module<Data, typeof ports> = {
  type: 'simple_substitution',
  node,
  calculate,
  defaultData: {
    source: ALPHABETS,
    target: ALPHABETS.split('')
      .map(() => '-')
      .join(''),
  },
  name: 'Simple Substitution',
  description: 'simple string substitution',
  ports,
}

function calculate({ node, inputs }: ModuleProcessProps<Data, typeof ports>) {
  return SimpleSubstitutionEncrypt(
    inputs?.input ?? '',
    node.data.source ?? '',
    node.data.target ?? ''
  ).encrypted
}

function SimpleSubstitutionEncrypt(
  text: string,
  source: string,
  target: string
): {
  encrypted: string
} {
  const encrypted = text.replace(/./g, (letter) => {
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

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs } = useNodeState<typeof ports>()
  const [source, setSource] = useState(initialData.source ?? '')
  const [target, setTarget] = useState(initialData.target ?? '')
  const highLightIndex = useMemo(() => {
    if (!inputs?.input) {
      return undefined
    }
    const lastChar = (inputs.input ?? '').slice(-1)
    return source.indexOf(lastChar) == -1 ? undefined : source.indexOf(lastChar)
  }, [inputs])

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
