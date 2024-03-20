import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'

type OutputData = {}

const OutputProcess: ModuleProcess<OutputData> = (node, params) => {
  return ''
}

export const OutputModule: Module<OutputData> = {
  type: 'output',
  node: Output,
  process: OutputProcess,
  defaultData: {
    value: '',
  },
  name: 'Output',
  description: `Basic text output field`,
  ports: {
    in: {
      input: {}
    },
    out: {},
  },
}

function Output({ id, data: initialData }: NodeProps<OutputData>) {
  const [data, setData] = useNodeDataState<OutputData>(id, initialData)

  return (
    <ModuleNode module={OutputModule} className={'border-module-output'}>
      <pre className={'nodrag select-text cursor-text'}>{data.inputs?.input}</pre>
    </ModuleNode>
  )
}
