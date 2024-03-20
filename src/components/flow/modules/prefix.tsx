import React from 'react'
import { NodeProps } from 'reactflow'
import {
  getOutput,
  ModuleProps,
  NodeProcess,
} from '@/components/flow/node-types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { getIncomersWithHandle } from '@/components/flow/utils/get-incomers-with-handle'

type PrefixData = {}

const PrefixProcess: NodeProcess<PrefixData> = (node, params, inputs) => {
  return (inputs.prefix ?? '') + (inputs.input ?? '')
}

export const PrefixModule: ModuleProps<PrefixData> = {
  type: 'prefix',
  node: Prefix,
  process: PrefixProcess,
  defaultData: {},
  name: 'Prefix',
  description: '{prefix}{input} → {output}',
  ports: {
    in: {
      input: {},
      prefix: {
        className: '-ml-20'
      }
    },
    out: {
      output: {}
    }
  },
}

function Prefix({ id, data: initialData }: NodeProps<PrefixData>) {
  return (
    <ModuleNode label="Prefix" className={'w-64'} />
  )
}
