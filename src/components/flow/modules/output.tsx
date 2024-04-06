import React from 'react'
import { NodeProps, NodeResizer, useUpdateNodeInternals } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { Resizer } from '@/components/flow/components/resizer'
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'

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
    <ModuleNode module={OutputModule} className={'border-module-output'}>
      <ModuleItemContainer
        className={'nodrag h-full select-text text-wrap cursor-text pb-4'}
      >
        <pre
          className={
            'nowheel overflow-y-scroll h-full text-background bg-muted-foreground p-4'
          }
        >
          {inputs?.input}
        </pre>
      </ModuleItemContainer>
      <Resizer id={id} selected={selected} />
    </ModuleNode>
  )
}
