import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

type PrefixData = {}

const PrefixProcess: ModuleProcess<PrefixData> = (node, params, inputs) => {
  return (inputs.prefix ?? '') + (inputs.input ?? '')
}

export const PrefixModule: Module<PrefixData> = {
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
    <ModuleNode module={PrefixModule} className={'w-64'} />
  )
}
