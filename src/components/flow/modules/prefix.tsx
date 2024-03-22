import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

type Data = {}

const ports = {
  in: {
    input: {},
    prefix: {
      className: '-ml-20',
    },
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

export const PrefixModule: Module<Data, typeof ports> = {
  type: 'prefix',
  node,
  calculate: ({ inputs }) => (inputs.prefix ?? '') + (inputs.input ?? ''),
  defaultData: {},
  name: 'Prefix',
  description: '{prefix}{input} → {output}',
  ports: {
    in: {
      input: {},
      prefix: {
        className: '-ml-20',
      },
    },
    out: {
      output: {},
    },
  },
}

function node({}: NodeProps<Data>) {
  return <ModuleNode module={PrefixModule} className={'w-64'} />
}
