import React, { useMemo } from 'react'
import { NodeProps } from 'reactflow'
import { Module, Ports } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports<Data>

export const WordCounterModule: Module<Data, typeof ports> = {
  type: 'word_counter',
  node,
  calculate: () => '',
  defaultData: {},
  name: 'Word Counter',
  description:
    'Count the number of space-separated strings and display them in order of frequency',
  ports,
}

type Counts = {
  word: string
  count: number
  percentage: string
}[]

function node({ id, data: initialData }: NodeProps<Data>) {
  const { inputs } = useNodeState<typeof ports>()
  const counts = useMemo(() => {
    if (!inputs?.input) {
      return []
    }
    const allCharCount = inputs.input.length
    const counts: Counts = []
    for (let char of inputs.input.split(' ')) {
      const index = counts.findIndex((c) => c.word === char)
      if (index == -1) {
        counts.push({
          word: char,
          count: 1,
          percentage: '0',
        })
      } else {
        counts[index] = {
          word: char,
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
  }, [inputs])

  return (
    <ModuleNode module={WordCounterModule}>
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
            <div key={c.word}>
              {c.word}: {c.count} ({c.percentage}%) <br />
            </div>
          )
        })}
      </div>
    </ModuleNode>
  )
}
