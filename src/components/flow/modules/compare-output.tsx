import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {}

const ports = {
  in: {
    input_A: {
      className: '-ml-16',
    },
    input_B: {
      className: 'ml-16',
    },
  },
  out: {},
} as const satisfies Ports<Data>

export const CompareOutputModule: Module<Data, typeof ports> = {
  type: 'compare_output',
  node,
  calculate: () => '',
  defaultData: {},
  name: 'Compare Output',
  description: `Display two text inputs (input_A and input_B) in parallel so that users can easily compare their contents.`,
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const { inputs } = useNodeState<typeof ports>()

  return (
    <ModuleNode module={CompareOutputModule}>
      <div className={'text-sm whitespace-pre'}>
        {inputs?.input_A?.split(/\n/).map((s, k) => {
          return (
            <div key={k} className={'py-1 leading-none'}>
              <span className={'font-bold'}>{s}</span> <br />
              <span className={'font-light text-muted-foreground'}>
                {inputs?.input_B?.split(/\n/)?.[k] ?? ''}
              </span>
              <br />
            </div>
          )
        }) ?? ''}
      </div>
    </ModuleNode>
  )
}
