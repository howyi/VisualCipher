import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getOutput,
  ModuleProps,
  NodeProcess,
} from '@/components/flow/node-types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { getIncomersWithHandle } from '@/components/flow/utils/get-incomers-with-handle'

type Data = {
  suffix?: string
}

const process: NodeProcess<Data> = (node, params, inputs) => {
  return (inputs.input) + (node.data.suffix ?? '')
}

export const SuffixModule: ModuleProps<Data> = {
  type: 'suffix',
  node: node,
  process,
  defaultData: {
    suffix: '.png',
  },
  name: 'Suffix',
  description: '',
  ports: {
    in: {
      input: {}
    },
    out: {
      output: {}
    }
  },
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeDataState<Data>(id, initialData)

  const [suffix, setSuffix] = useState(initialData.suffix)
  useEffect(() => {
    setData({
      suffix,
    })
  }, [suffix])

  return (
    <ModuleNode label="Suffix">
      <div className={'flex m-auto gap-2'}>
        <Label htmlFor="text" className={'my-auto'}>
          +
        </Label>
        <Input
          id="text"
          name="text"
          value={suffix}
          onChange={(e) => setSuffix(e.target.value)}
          className="nodrag"
        />
      </div>
    </ModuleNode>
  )
}
