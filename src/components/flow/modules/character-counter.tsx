import React, { useMemo } from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports

export const CharacterCounterModule: Module<Data, typeof ports> = {
  type: 'character_counter',
  node,
  calculate: () => '',
  defaultData: {},
  name: 'Character Counter',
  description:
    'Counts the characters in the string inputted from {in} and displays them in order of frequency.',
  ports,
}

type Counts = {
  character: string
  count: number
  percentage: string
}[]

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeDataState<Data, typeof ports>(id, initialData)
  const counts = useMemo(() => {
    if (!data.inputs?.input) {
      return []
    }
    const allCharCount = data.inputs.input.length
    const counts: Counts = []
    for (let char of data.inputs.input.split('')) {
      const index = counts.findIndex((c) => c.character === char)
      if (index == -1) {
        counts.push({
          character: char,
          count: 1,
          percentage: '0',
        })
      } else {
        counts[index] = {
          character: char,
          count: counts[index].count + 1,
          percentage: '0',
        }
      }
    }
    for (let count of counts) {
      count.percentage = `${((count.count / allCharCount) * 100).toFixed(2)}%`
    }

    counts.sort((a, b) => {
      return a.count > b.count ? -1 : 1
    })
    return counts
  }, [data])

  return (
    <ModuleNode module={CharacterCounterModule}>
      <div
        className={
          'flex flex-col justify-center m-auto gap-2 font-mono whitespace-pre'
        }
      >
        {counts.map((c, k) => {
          if (k > 10) {
            return
          }
          return (
            <div key={c.character}>
              {c.character}: {c.count} ({c.percentage}%) <br />
            </div>
          )
        })}
      </div>
    </ModuleNode>
  )
}
