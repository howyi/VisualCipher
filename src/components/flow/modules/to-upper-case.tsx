import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports

export const ToUpperCaseModule: Module<Data, typeof ports> = {
  type: 'to_upper_case',
  node,
  process: ({ inputs }) => inputs.input?.toUpperCase() ?? '',
  defaultData: {},
  name: 'TO UPPER CASE',
  description: '',
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  return (
    <ModuleNode module={ToUpperCaseModule}>
      <div className={'w-40'}></div>
    </ModuleNode>
  )
}
