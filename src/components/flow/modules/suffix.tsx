import React, { useEffect, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { z } from 'zod'

type Data = {
  suffix?: string
}

const ports = {
  in: {
    input: {
      validate: (data) => z.string(),
    },
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

export const SuffixModule: Module<Data, typeof ports> = {
  type: 'suffix',
  node,
  calculate,
  defaultData: {
    suffix: '.png',
  },
  name: 'Suffix',
  description: '',
  ports,
}

function calculate({ node, inputs }: ModuleProcessProps<Data, typeof ports>) {
  return inputs.input + (node.data.suffix ?? '')
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)

  const [suffix, setSuffix] = useState(initialData.suffix)
  useEffect(() => {
    setData({
      suffix,
    })
  }, [suffix])

  return (
    <ModuleNode module={SuffixModule}>
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
