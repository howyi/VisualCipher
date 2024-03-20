import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

export type Data = {}

export const ToUpperCaseProcess: ModuleProcess<Data> = (
  node,
  params,
  inputs
) => {
  return inputs.input?.toUpperCase() ?? ''
}

export const ToUpperCaseModule: Module<Data> = {
  type: 'to_upper_case',
  node: ToUpperCase,
  process: ToUpperCaseProcess,
  defaultData: {},
  name: 'TO UPPER CASE',
  description: '',
  ports: {
    in: {
      input: {},
    },
    out: {
      output: {},
    },
  },
}

export function ToUpperCase({ id, data: initialData }: NodeProps<Data>) {
  return (
    <ModuleNode module={ToUpperCaseModule}>
      <div className={'w-40'}></div>
    </ModuleNode>
  )
}
