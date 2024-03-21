import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports

export const OutputModule: Module<Data, typeof ports> = {
  type: 'output',
  node,
  process: () => '',
  defaultData: {
    value: '',
  },
  name: 'Output',
  description: `Basic text output field`,
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeDataState<Data, typeof ports>(id, initialData)

  return (
    <ModuleNode module={OutputModule} className={'border-module-output'}>
      <pre className={'nodrag select-text cursor-text'}>
        {data.inputs?.input}
      </pre>
    </ModuleNode>
  )
}
