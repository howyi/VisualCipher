import React from 'react'
import { NodeProps } from 'reactflow'
import {
  getOutput,
  ModuleProps,
  NodeProcess,
} from '@/components/flow/node-types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { getIncomersWithHandle } from '@/components/flow/utils/get-incomers-with-handle'

type OutputData = {}

const OutputProcess: NodeProcess<OutputData> = (node, params) => {
  return ''
}

export const OutputModule: ModuleProps<OutputData> = {
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
    <ModuleNode label={'Output'} className={'border-module-output'}>
      <pre className={'nodrag select-text cursor-text'}>{data.inputs?.input}</pre>
    </ModuleNode>
  )
}
