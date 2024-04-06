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
} as const satisfies Ports<Data>

export const ReverseModule: Module<Data, typeof ports> = {
  type: 'reverse',
  node,
  calculate: ({ inputs }) => inputs.input?.split('').reverse().join('') ?? '',
  defaultData: {},
  name: 'reverse',
  description: 'Reversing a String',
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  return <ModuleNode module={ReverseModule}></ModuleNode>
}
