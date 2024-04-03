import React, { useEffect, useState } from 'react'
import { NodeProps, Position } from 'reactflow'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { NumberProperty } from '@/components/flow/components/properties/number-property'
import { OutputHandle } from '@/components/flow/components/handle'

type Data = {
  freq: number
}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports<Data>

function calculate({
  node,
  inputs,
  portId,
}: ModuleProcessProps<Data, typeof ports>) {
  const period = parseInt(portId)

  return inputs.input
    ?.replaceAll('\n', '')
    .replaceAll(' ', '')
    .split('')
    .filter((i, k) => {
      if (i === '\n') return false
      return k % node.data.freq === period - 1
    })
    .join('')
}

export const SliceModule: Module<Data, typeof ports> = {
  type: 'slice',
  node,
  // @ts-ignore
  calculate,
  defaultData: {
    freq: 3,
  },
  name: 'Slice',
  description: ``,
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const [freq, setFreq] = useState(initialData.freq)

  useEffect(() => {
    setData({ freq })
  }, [freq])

  return (
    <ModuleNode module={SliceModule} className={'w-[500px]'}>
      <div className={'flex flex-col gap-2'}>
        <NumberProperty
          min={1}
          label={'freq'}
          value={freq}
          setValue={setFreq}
        />
      </div>

      {[...Array(freq)].map((e, i) => {
        return (
          <OutputHandle
            id={`${i + 1}`}
            key={`${i + 1}`}
            position={Position.Bottom}
            style={{
              marginLeft: `${-200 + -i * -50}px`,
            }}
            description={''}
          />
        )
      })}
    </ModuleNode>
  )
}
