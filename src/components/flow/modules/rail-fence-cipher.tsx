import React from 'react'
import { NodeProps } from 'reactflow'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { Button } from '@/components/ui/button'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'

type Data = {
  rails?: number
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports

export const RailFenceCipherModule: Module<Data, typeof ports> = {
  type: 'rail_fence_cipher',
  node,
  calculate,
  defaultData: {
    rails: 3,
  },
  name: 'Rail Fence Cipher',
  description: ``,
  ports,
}

function calculate({ node, inputs }: ModuleProcessProps<Data, typeof ports>) {
  return RailFenceCipherEncrypt(inputs.input ?? '', node.data.rails ?? 3)
    .encrypted
}

export function RailFenceCipherEncrypt(
  text: string,
  rails: number
): {
  encrypted: string
} {
  return {
    encrypted: '',
  }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeDataState<Data, typeof ports>(id, initialData)

  const shiftLeft = () => {
    setData({
      rails: (data.rails ?? 0) - 1,
    })
  }
  const shiftRight = () => {
    setData({
      rails: (data.rails ?? 0) + 1,
    })
  }

  return (
    <ModuleNode module={RailFenceCipherModule}>
      <div className={'flex flex-col m-auto gap-2'}>
        <div className={'flex flex-row gap-2'}>
          <Button
            size={'xs'}
            onClick={shiftLeft}
            className={'flex-0 w-12'}
            variant="outline"
          >
            ←
          </Button>
          <div
            className={
              'flex-1 text-center text-muted-foreground text-xs m-auto'
            }
          >
            RAILS: {data.rails}
          </div>
          <Button
            size={'xs'}
            onClick={shiftRight}
            className={'flex-0 w-12'}
            variant="outline"
          >
            →
          </Button>
        </div>
      </div>
    </ModuleNode>
  )
}
