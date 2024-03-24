import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports<Data>

export const OutputModule: Module<Data, typeof ports> = {
  type: 'output',
  node,
  calculate: () => '',
  defaultData: {
    value: '',
  },
  name: 'Output',
  description: `Basic text output field`,
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const { inputs } = useNodeState<typeof ports>()

  return (
    <ModuleNode module={OutputModule} className={'border-module-output'}>
      <pre className={'nodrag select-text cursor-text'}>{inputs?.input}</pre>
    </ModuleNode>
  )
}
