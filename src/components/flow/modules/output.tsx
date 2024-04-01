import React from 'react'
import { NodeProps, NodeResizer, useUpdateNodeInternals } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { Resizer } from '@/components/flow/components/resizer'

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

function node({ id, data: initialData, selected }: NodeProps<Data>) {
  const { inputs } = useNodeState<typeof ports>()
  const updateNodeInternals = useUpdateNodeInternals()

  return (
    <ModuleNode module={OutputModule} className={'h-full border-module-output'}>
      <pre className={'nodrag select-text text-wrap cursor-text'}>
        {inputs?.input}
      </pre>
      <Resizer id={id} selected={selected} />
    </ModuleNode>
  )
}
