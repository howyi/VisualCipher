import React from 'react'
import { NodeProps } from 'reactflow'
import {
  getOutput,
  ModuleProps,
  NodeProcess,
} from '@/components/flow/node-types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { getIncomersWithHandle } from '@/components/flow/utils/get-incomers-with-handle'

export type Data = {}

export const ToUpperCaseProcess: NodeProcess<Data> = (node, params, inputs) => {
  return inputs.input?.toUpperCase() ?? ''
}

export const ToUpperCaseModule: ModuleProps<Data> = {
  type: 'to_upper_case',
  node: ToUpperCase,
  process: ToUpperCaseProcess,
  defaultData: {},
  name: 'TO UPPER CASE',
  description: '',
  ports: {
    in: {
      input: {}
    },
    out: {
      output: {}
    },
  },
}

export function ToUpperCase({ id, data: initialData }: NodeProps<Data>) {
  return (
    <ModuleNode label="TO UPPER CASE">
      <div className={'w-40'}></div>
    </ModuleNode>
  )
}
