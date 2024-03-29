import React, { useEffect, useMemo, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReaderIcon } from '@radix-ui/react-icons'
import { StringConnector } from '@/components/flow/components/string-connector'
import { ALPHABETS } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import { ReflectorTemplates } from '@/components/flow/modules/enigma/reflector-templates'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

type Data = {
  wiring?: string
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
  encrypted: string
  currentTopHighlightIndex?: number
  currentBottomHighlightIndex?: number
  error?: string
}

export const EnigmaReflectorModule: Module<Data, typeof ports, Result> = {
  type: 'enigma_reflector',
  node,
  calculate,
  defaultData: {
    wiring: 'EJMZALYXVBWFCRQUONTSPIKHGD',
  },
  name: 'Enigma Reflector (UKW, Umkehrwalze)',
  description: `Reflector emulator for Enigma cryptograph.
Wiring settings are made, and when text is input, reflector processing is output according to the wiring.`,
  ports,
}

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>): string {
  const result = EnigmaReflectorEncrypt(
    inputs.input ?? '',
    node.data.wiring ?? ''
  )
  setResult(result)
  return result.encrypted
}

export function EnigmaReflectorEncrypt(
  text: string,
  wiring: string
): {
  encrypted: string
  currentTopHighlightIndex?: number
  currentBottomHighlightIndex?: number
  error?: string
} {
  let encrypted = ''
  let currentTopIndex = undefined
  let currentBottomIndex = undefined
  if (!text.match(/^[A-Z]*$/)) {
    return {
      encrypted: encrypted,
      currentTopHighlightIndex: currentTopIndex,
      currentBottomHighlightIndex: currentBottomIndex,
      error: 'Reflector machine can only use uppercase letters.',
    }
  }
  for (let sourceCharacter of text.split('')) {
    currentTopIndex = ALPHABETS.indexOf(sourceCharacter)
    const currentTopCharacter = ALPHABETS.slice(
      currentTopIndex,
      currentTopIndex + 1
    )
    currentBottomIndex = wiring.indexOf(currentTopCharacter)
    encrypted += ALPHABETS.slice(currentBottomIndex, currentBottomIndex + 1)
  }

  return {
    encrypted: encrypted,
    currentTopHighlightIndex: currentTopIndex,
    currentBottomHighlightIndex: currentBottomIndex,
  }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [nodeData, setNodeData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()
  const [wiring, setWiring] = useState(initialData.wiring ?? '')
  const wiringLabel = useMemo(() => {
    const found = ReflectorTemplates.find((r) => r.wiring === wiring)
    return found ? found.name : 'Custom'
  }, [wiring])

  useEffect(() => {
    setNodeData({
      ...nodeData,
      wiring,
    })
  }, [wiring])

  // https://en.wikipedia.org/wiki/Reflector_(cipher_machine)
  return (
    <ModuleNode module={EnigmaReflectorModule} className={'w-[300px]'}>
      <div className={'flex flex-col gap-1'}>
        <div className={'flex flex-row m-auto w-full gap-1 whitespace-pre'}>
          <Label className={'flex-0 my-auto pl-1'}>Wiring: </Label>
          <div
            className={
              'flex-1 text-center text-xs text-muted-foreground my-auto'
            }
          >
            {wiringLabel}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'sm'} variant={'outline'} className={'flex-0'}>
                <ReaderIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ReflectorTemplates.map((r) => (
                <DropdownMenuItem
                  key={r.name}
                  onClick={() => setWiring(r.wiring)}
                >
                  <span>{r.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input
          className={'text-sm text-center'}
          type="text"
          value={wiring}
          onChange={(e) => setWiring(e.target.value)}
        />
        <Separator className={'my-2'} />
        <div className={'flex flex-col m-auto gap-1 whitespace-pre'}>
          <Label className={'my-auto'}>
            <Highlight
              index={result?.currentTopHighlightIndex}
              className={'text-module-input'}
              text={ALPHABETS}
            />
          </Label>
          <Label className={'my-auto'}>
            <StringConnector
              top={result?.currentTopHighlightIndex}
              bottom={result?.currentBottomHighlightIndex}
            />
          </Label>
          <Label className={'my-auto'}>
            <Highlight
              index={result?.currentBottomHighlightIndex}
              className={'text-module-hint'}
              text={nodeData.wiring ?? ''}
            />
          </Label>
          <Label className={'my-auto'}>
            <StringConnector
              top={result?.currentBottomHighlightIndex}
              bottom={result?.currentBottomHighlightIndex}
            />
          </Label>
          <Label className={'my-auto text-muted-foreground'}>
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
