import React, { useMemo } from 'react'
import { NodeProps } from 'reactflow'
import { Label } from '@/components/ui/label'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { Checkbox } from '@/components/ui/checkbox'
import { StringConnector } from '@/components/flow/components/string-connector'
import { StringShift } from '@/components/flow/utils/string-shift'
import { ALPHABETS } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {
  reverse?: boolean
}

const ports = {
  in: {
    scrambler: {
      className: '-ml-28',
      description: 'from Scrambler Port',
    },
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

type Result = {
  encrypted: string
  currentTopHighlightIndex?: number
  currentTop: string
  currentBottomHighlightIndex?: number
  currentBottom: string
  turn: string
  error?: string
}

export const EnigmaScramblerInterfaceModule: Module<
  Data,
  typeof ports,
  Result
> = {
  type: 'enigma_scrambler_interface',
  node,
  calculate,
  defaultData: {
    reverse: false,
  },
  name: 'Enigma Scrambler Interface',
  description: `Interface that connects from Scrambler and emulates the actual Scrambler signal
Enigma cipher uses the same Scrambler twice in a single conversion process, once in forward and once in reverse
Set reverse to true if you want to perform the process in reverse order.`,
  ports,
}

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>) {
  if (!inputs.scrambler) {
    return ''
  }
  const { top, bottom, rotate } = JSON.parse(inputs.scrambler)

  const result = EnigmaScramblerInterfaceEncrypt(
    inputs.input ?? '',
    top ?? '',
    bottom ?? '',
    rotate ?? '',
    !!node.data.reverse
  )
  setResult(result)
  if (result.error) {
    throw new Error(result.error)
  }

  return result.encrypted
}

function EnigmaScramblerInterfaceEncrypt(
  text: string,
  top: string,
  bottom: string,
  rotate: string,
  reverse: boolean
): Result {
  if (!top || !bottom) {
    return {
      encrypted: '',
      currentTopHighlightIndex: undefined,
      currentTop: '',
      currentBottomHighlightIndex: undefined,
      currentBottom: '',
      turn: '',
      error: '',
    }
  }
  let encrypted = ''
  let currentTopIndex = undefined
  let currentBottomIndex = undefined
  let [currentTop, currentBottom] = [top, bottom]
  if (reverse) {
    ;[currentTop, currentBottom] = [currentBottom, currentTop]
  }
  if (!text.match(/^[A-Z]*$/)) {
    return {
      encrypted: encrypted,
      currentTopHighlightIndex: currentTopIndex,
      currentTop: currentTop,
      currentBottomHighlightIndex: currentBottomIndex,
      currentBottom: currentBottom,
      turn: '',
      error: 'The ENIGMA cipher machine can only use uppercase letters.',
    }
  }
  let currentLength = 1
  let turned = ''
  for (let sourceCharacter of text.split('')) {
    // ENIGMA ROTAR ROTATE BEFORE PROCESSING
    if (rotate.slice(currentLength - 1, currentLength) === '1') {
      currentTop = StringShift(currentTop, -1)
      currentBottom = StringShift(currentBottom, -1)
    }
    currentTopIndex = ALPHABETS.indexOf(sourceCharacter)
    const shiftedAlphabet = currentTop.slice(
      currentTopIndex,
      currentTopIndex + 1
    )
    currentBottomIndex = currentBottom.indexOf(shiftedAlphabet)
    encrypted += ALPHABETS.slice(currentBottomIndex, currentBottomIndex + 1)
    currentLength++
  }

  return {
    encrypted: encrypted,
    currentTopHighlightIndex: currentTopIndex,
    currentTop: currentTop,
    currentBottomHighlightIndex: currentBottomIndex,
    currentBottom: currentBottom,
    turn: turned,
  }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()

  return (
    <ModuleNode module={EnigmaScramblerInterfaceModule}>
      <div className={'flex flex-col m-auto gap-2 pt-2 w-[340px]'}>
        <div className={'flex flex-row gap-2'}>
          <div className="flex items-center mx-auto space-x-2">
            <Checkbox
              checked={data.reverse}
              id="reverse"
              onCheckedChange={(e) => setData({ ...data, reverse: !!e })}
            />
            <label
              htmlFor="reverse"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Reverse
            </label>
          </div>
        </div>
        <div className={'flex flex-col m-auto gap-1 font-mono whitespace-pre'}>
          <Label className={' text-muted-foreground'}>
            <Highlight
              index={result?.currentTopHighlightIndex}
              className={'text-module-input'}
              text={ALPHABETS}
            />
          </Label>
          <Label>
            <StringConnector
              top={result?.currentTopHighlightIndex}
              bottom={result?.currentTopHighlightIndex}
            />
          </Label>
          <Label>
            <Highlight
              index={result?.currentTopHighlightIndex}
              className={'text-module-hint'}
              text={result?.currentTop ?? ''}
            />
          </Label>
          <Label>
            <StringConnector
              top={result?.currentTopHighlightIndex}
              bottom={result?.currentBottomHighlightIndex}
            />
          </Label>
          <Label>
            <Highlight
              index={result?.currentBottomHighlightIndex}
              className={'text-module-hint'}
              text={result?.currentBottom ?? ''}
            />
          </Label>
          <Label>
            <StringConnector
              top={result?.currentBottomHighlightIndex}
              bottom={result?.currentBottomHighlightIndex}
            />
          </Label>
          <Label className={' text-muted-foreground'}>
            <Highlight
              index={result?.currentBottomHighlightIndex}
              className={'text-module-output'}
              text={ALPHABETS}
            />
          </Label>
        </div>
      </div>
    </ModuleNode>
  )
}
