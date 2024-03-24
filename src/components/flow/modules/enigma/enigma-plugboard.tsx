import React, { useMemo } from 'react'
import { NodeProps } from 'reactflow'
import { Label } from '@/components/ui/label'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { StringConnector } from '@/components/flow/components/string-connector'
import { Highlight } from '@/components/flow/components/highlight'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {}

const ports = {
  in: {
    input: {},
    plugs: {
      className: '-ml-24',
      description: (
        <>
          eg: [AB CD]
          <br />
          Set of space-separated replacement strings
        </>
      ),
    },
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

type Result = {
  encrypted: string
}

export const EnigmaPlugBoardModule: Module<Data, typeof ports, Result> = {
  type: 'enigma_plug_board',
  node,
  calculate,
  defaultData: {},
  name: 'Enigma Plug Board (Steckerbrett)',
  description: `plugs[AB CD] input[ABCX] → output[BADX]
Plugboard Emulator for Enigma Crypto Machines
Passing a space-separated set of two characters to {plugs} replaces the corresponding part of the string entered with {input}.`,
  ports,
}

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>): string {
  const result = EnigmaPlugBoardEncrypt(inputs.input ?? '', inputs.plugs ?? '')
  setResult(result)
  return result.encrypted
}

function EnigmaPlugBoardEncrypt(text: string, plugs: string): Result {
  const source = plugs
    .split(' ')
    .map((s) => s.charAt(0) + s.charAt(1))
    .join('')
    .toUpperCase()
  const target = plugs
    .split(' ')
    .map((s) => s.charAt(1) + s.charAt(0))
    .join('')
    .toUpperCase()
  const encrypted = text.replace(
    /[a-z]/gi,
    (letter) => target?.[source.indexOf(letter)] ?? letter
  )
  return {
    encrypted: encrypted,
  }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const { inputs } = useNodeState<typeof ports, Result>()
  const source = useMemo(() => {
    return (
      inputs?.plugs
        ?.split(' ')
        .map((s) => s.charAt(0) + s.charAt(1))
        .join(' ')
        .toUpperCase() ?? ''
    )
  }, [inputs])
  const target = useMemo(() => {
    return (
      inputs?.plugs
        ?.split(' ')
        .map((s) => s.charAt(1) + s.charAt(0))
        .join(' ')
        .toUpperCase() ?? ''
    )
  }, [inputs])
  const currentIndex = useMemo(() => {
    if (!source || !inputs) {
      return undefined
    }
    if (!inputs.input || inputs.input?.charAt(-1)) {
      return undefined
    }
    const index = source.indexOf(inputs.input.charAt(inputs.input.length - 1))
    if (index == -1) {
      return undefined
    }
    return index
  }, [inputs])

  return (
    <ModuleNode module={EnigmaPlugBoardModule}>
      <div className={'flex flex-col gap-1 m-auto w-60'}>
        <Label className={'my-auto'}>
          <Highlight
            index={currentIndex}
            className={'text-module-input'}
            text={source}
            notch={''}
          />
        </Label>
        <Label className={'my-auto'}>
          <StringConnector top={currentIndex} bottom={currentIndex} />
        </Label>
        <Label className={'my-auto'}>
          <Highlight
            index={currentIndex}
            className={'text-module-output'}
            text={target}
            notch={''}
          />
        </Label>
      </div>
    </ModuleNode>
  )
}
