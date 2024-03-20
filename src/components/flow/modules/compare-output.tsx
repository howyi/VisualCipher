import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'

export type CompareOutputData = {}

const CompareOutputProcess: ModuleProcess<CompareOutputData> = (
  node,
  params
) => {
  return ''
}

export const CompareOutputModule: Module<CompareOutputData> = {
  type: 'compare_output',
  node: CompareOutput,
  process: CompareOutputProcess,
  defaultData: {},
  name: 'Compare Output',
  description: `Display two text inputs (input_A and input_B) in parallel so that users can easily compare their contents.`,
  ports: {
    in: {
      input_A: {
        className: '-ml-16',
      },
      input_B: {
        className: 'ml-16',
      },
    },
    out: {},
  },
}

function CompareOutput({
  id,
  data: initialData,
}: NodeProps<CompareOutputData>) {
  const [data, setData] = useNodeDataState<CompareOutputData>(id, initialData)

  return (
    <ModuleNode module={CompareOutputModule}>
      <div className={'text-sm whitespace-pre'}>
        {data.inputs?.input_A?.split(/\n/).map((s, k) => {
          return (
            <div key={k} className={'py-1 leading-none'}>
              <span className={'font-bold'}>{s}</span> <br />
              <span className={'font-light text-muted-foreground'}>
                {data.inputs?.input_B?.split(/\n/)?.[k] ?? ''}
              </span>
              <br />
            </div>
          )
        }) ?? ''}
      </div>
    </ModuleNode>
  )
}
