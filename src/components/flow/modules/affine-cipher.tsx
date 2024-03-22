import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps } from 'reactflow'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { Button } from '@/components/ui/button'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { z } from 'zod'
import { ALPHABETS, UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import { StringConnector } from '@/components/flow/components/string-connector'
import { NumberProperty } from '@/components/flow/components/properties/number-property'
import { useBoolean } from 'usehooks-ts'
import { CheckProperty } from '@/components/flow/components/properties/check-property'

type Data = {
  a: number
  b: number
  decryptMode: boolean
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

type Result = {
  output: string
  lastIndex: number | undefined
  targetIndexes: number[]
  source: string[]
  target: string[]
}

export const AffineCipherModule: Module<Data, typeof ports, Result> = {
  type: 'affine_cipher',
  node,
  calculate,
  defaultData: {
    a: 5,
    b: 8,
    decryptMode: false,
  },
  name: 'Affine Cipher',
  description: `Each letter of the alphabet is converted to a number, and the converted number is mapped to another number using a linear function (ax + b mod m). Here, a and b are the encryption keys and m is the size of the alphabet (26).`,
  ports,
}

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>) {
  const result = AffineCipherEncrypt(
    inputs.input ?? '',
    node.data.a,
    node.data.b,
    node.data.decryptMode
  )
  setResult(result)
  return result.output
}

export function AffineCipherEncrypt(
  text: string,
  a: number,
  b: number,
  decryptMode: boolean
): Result {
  const targetIndexes = ALPHABETS.split('').map(
    (source, index) => (a * index + b) % ALPHABETS.length
  )
  let source = ALPHABETS.split('')
  let target = targetIndexes.map((i) => ALPHABETS.charAt(i))
  if (decryptMode) {
    ;[source, target] = [target, source]
  }

  const sourceText = source.join('') + source.join('').toLowerCase()
  const targetText = target.join('') + target.join('').toLowerCase()
  let output = text.replace(/[a-z]/gi, (letter) => {
    const index = sourceText.indexOf(letter)
    if (index == -1) {
      return UNKNOWN_CHARACTER
    }
    return targetText[index] ?? UNKNOWN_CHARACTER
  })
  let lastIndex =
    source.indexOf(text.charAt(text.length - 1).toUpperCase()) == -1
      ? undefined
      : source.indexOf(text.charAt(text.length - 1).toUpperCase())
  return { output, targetIndexes, lastIndex, source, target }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()
  const [a, setA] = useState(initialData.a)
  const [b, setB] = useState(initialData.b)
  const decryptMode = useBoolean(initialData.decryptMode ?? false)

  useEffect(() => {
    setData({ a, b, decryptMode: decryptMode.value })
  }, [a, b, decryptMode])

  return (
    <ModuleNode module={AffineCipherModule}>
      <div className={'text-left flex flex-col mx-auto gap-2'}>
        <div className={'flex flex-row'}>
          <div className={'flex flex-col gap-2'}>
            <CheckProperty label={'decrypt'} value={decryptMode} />
            <NumberProperty
              label={'A'}
              min={0}
              max={ALPHABETS.length}
              value={a}
              setValue={setA}
              unit={2}
            />
            <NumberProperty label={'B'} min={1} value={b} setValue={setB} />
          </div>
          <div className={'m-auto'}>
            <span className={'font-serif text-bold text-lg text-module-hint'}>
              y
            </span>
            <span
              className={'font-serif text-bold text-lg text-foreground'}
            >{` = (${a}x + ${b})mod${ALPHABETS.length}`}</span>
          </div>
        </div>
        <div className={'flex flex-col gap-[1px]'}>
          <Label className={'text-muted-foreground'}>
            {'│'}
            <Highlight
              index={
                result?.lastIndex !== undefined
                  ? result.lastIndex * 3
                  : undefined
              }
              width={2}
              className={
                data.decryptMode ? 'text-module-output' : 'text-module-input'
              }
              text={ALPHABETS.split('').join(' │') ?? ''}
              notch={''}
            />
            {' │'}
          </Label>
          <Label className={'text-muted-foreground'}>
            {'│'}
            <Highlight
              index={undefined}
              width={2}
              className={'text-module-hint'}
              text={
                ALPHABETS.split('')
                  .map((i, k) => ('00' + k).slice(-2))
                  .join('│') ?? ''
              }
              notch={''}
            />
            {'│'}
            <span
              className={'font-serif text-bold text-foreground'}
            >{`x`}</span>
          </Label>
          <Label className={'text-muted-foreground'}>
            {'│'}
            <Highlight
              index={
                result?.lastIndex !== undefined
                  ? result.lastIndex * 3
                  : undefined
              }
              width={2}
              className={'text-module-hint'}
              text={
                result?.targetIndexes
                  .map((i) => ('00' + i).slice(-2))
                  .join('│') ?? ''
              }
              notch={''}
            />
            {`│`}
            <span
              className={'font-serif text-bold text-module-hint'}
            >{`y`}</span>
          </Label>
          <Label className={'text-muted-foreground'}>
            {' '}
            <StringConnector
              top={
                result?.lastIndex !== undefined
                  ? result.lastIndex * 3
                  : undefined
              }
              bottom={
                result?.lastIndex !== undefined
                  ? result?.targetIndexes[result.lastIndex] * 3
                  : undefined
              }
            />
          </Label>
          <Label className={'text-muted-foreground'}>
            {'│'}
            <Highlight
              index={undefined}
              width={2}
              className={'text-module-hint'}
              text={
                ALPHABETS.split('')
                  .map((i, k) => ('00' + k).slice(-2))
                  .join('│') ?? ''
              }
              notch={''}
            />
            {'│'}
          </Label>
          <Label className={'text-muted-foreground'}>
            {'│'}
            <Highlight
              index={
                result?.lastIndex !== undefined
                  ? result?.targetIndexes[result.lastIndex] * 3
                  : undefined
              }
              className={
                data.decryptMode ? 'text-module-input' : 'text-module-output'
              }
              text={ALPHABETS.split('').join(' │') ?? ''}
              notch={''}
            />
            {' │'}
          </Label>
        </div>
      </div>
    </ModuleNode>
  )
}
