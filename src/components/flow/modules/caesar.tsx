import React, { useMemo } from 'react'
import { NodeProps } from 'reactflow'
import { Label } from '@/components/ui/label'
import { ModuleNode } from '@/components/flow/components/module-node'
import { Button } from '@/components/ui/button'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { StringShift } from '@/components/flow/utils/string-shift'
import { ALPHABETS, UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {
  shift?: number
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports

type Result = {
  encrypted: string
  highlightIndex: number
  shiftedAlphabetsText: string
}

export const CaesarModule: Module<Data, typeof ports, Result> = {
  type: 'caesar',
  node,
  calculate,
  defaultData: {
    shift: 3,
  },
  name: 'Caesar Cipher',
  description: `[ABC] → [BCD]
Provides the ability to encrypt input text with the Caesar cipher.
The Caesar cipher is a classic cryptographic technique that encrypts a string of text by shifting a certain number of letters of the alphabet.
The user can enter any text and specify the number of letters to be shifted to encrypt that text. For example, if the number of shifts is 3, "ABC" is converted to "DEG" and "HELLO" is converted to "KHOOR".
`,
  ports,
}

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>) {
  if (!inputs.input || !node.data.shift) {
    return ''
  }
  const shifted = StringShift(ALPHABETS, node.data.shift)
  const encrypted = inputs.input.replace(/[a-z]/gi, (letter) => {
    const index = ALPHABETS.indexOf(letter)
    if (index == -1) {
      return UNKNOWN_CHARACTER
    }
    return shifted[index] ?? UNKNOWN_CHARACTER
  })

  setResult({
    encrypted: encrypted,
    highlightIndex: ALPHABETS.indexOf(inputs.input.slice(-1)),
    shiftedAlphabetsText: shifted,
  })

  return encrypted
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()
  const shiftedAlphabetsText = useMemo(() => {
    return StringShift(ALPHABETS, data.shift ?? 0)
  }, [data.shift])

  const shiftLeft = () => {
    setData({
      shift: (data.shift ?? 0) - 1,
    })
  }
  const shiftRight = () => {
    setData({
      shift: (data.shift ?? 0) + 1,
    })
  }

  return (
    <ModuleNode module={CaesarModule}>
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
            ROTATE: {data.shift}
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
        <Label className={'my-auto font-mono'}>
          <Highlight
            index={result?.highlightIndex}
            className={'text-module-input'}
            text={ALPHABETS}
          />
        </Label>
        <Label className={'my-auto font-mono'}>
          <Highlight
            index={result?.highlightIndex}
            className={'text-module-output'}
            text={shiftedAlphabetsText}
          />
        </Label>
      </div>
    </ModuleNode>
  )
}
