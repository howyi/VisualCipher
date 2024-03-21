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

type Data = {
  rails?: number
  decryptMode?: boolean
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
    decryptMode: false,
  },
  name: 'Rail Fence Cipher',
  description: `It provides the ability to encrypt text by placing it in waveforms along a specific number of rails (lines) and concatenating them line by line. This encryption method is a simple method of visually transforming text and does not require complex calculations. Can adjust the difficulty level of text encryption by specifying the number of rails.`,
  ports,
}

function calculate({ node, inputs }: ModuleProcessProps<Data, typeof ports>) {
  return RailFenceCipherEncrypt(
    inputs.input ?? '',
    node.data.rails ?? 3,
    !!node.data.decryptMode
  ).output
}

function getSpan(rails: number, row: number, direction: 'up' | 'down'): number {
  if (row == 0 || row == rails - 1) {
    return (rails - 1) * 2 - 1
  }
  if (direction == 'up') {
    return (rails - row - 1) * 2 - 1
  } else {
    return (rails - (rails - row)) * 2 - 1
  }
}

function decipher(ciphertext: string, rails: number): string {
  let rowCursor = 1
  let rowDirection: 'up' | 'down' = 'down'
  const lines = ciphertext.split(' ')
  let plaintext = ''
  while (true) {
    const line = lines[rowCursor - 1]
    const deciphered = line?.charAt(0)
    if (!deciphered) {
      break
    }
    plaintext += deciphered
    lines[rowCursor - 1] = line.slice(1)
    if (rowDirection == 'down') {
      if (rowCursor === rails) {
        rowDirection = 'up'
        rowCursor--
      } else {
        rowCursor++
      }
    } else {
      if (rowCursor === 1) {
        rowDirection = 'down'
        rowCursor++
      } else {
        rowCursor--
      }
    }
  }
  return plaintext
}

export function RailFenceCipherEncrypt(
  text: string,
  rails: number,
  decryptMode: boolean
): { output: string; linesWithSpan: string[] } {
  if (rails <= 1) {
    return {
      output: text,
      linesWithSpan: [text],
    }
  }

  const plaintext = decryptMode ? decipher(text, rails) : text
  let rowCursor = 1
  let rowDirection: 'up' | 'down' = 'down'
  const lines: string[] = []
  const linesWithSpan: string[] = []
  for (let character of plaintext.split('')) {
    if (lines[rowCursor - 1]) {
      const span = getSpan(rails, rowCursor - 1, rowDirection)
      lines[rowCursor - 1] += character
      linesWithSpan[rowCursor - 1] += ' '.repeat(span) + character
    } else {
      const offset = ' '.repeat(rowCursor - 1)
      lines[rowCursor - 1] = character
      linesWithSpan[rowCursor - 1] = offset + character
    }
    if (rowDirection == 'down') {
      if (rowCursor === rails) {
        rowDirection = 'up'
        rowCursor--
      } else {
        rowCursor++
      }
    } else {
      if (rowCursor === 1) {
        rowDirection = 'down'
        rowCursor++
      } else {
        rowCursor--
      }
    }
  }
  return { output: decryptMode ? plaintext : lines.join(' '), linesWithSpan }
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data, typeof ports>(id, initialData)
  const [decryptMode, setDecryptMode] = useState(
    initialData.decryptMode ?? false
  )
  const [rails, setRails] = useState(initialData.rails ?? 3)
  const result = useMemo(() => {
    return RailFenceCipherEncrypt(
      data.inputs?.input ?? '',
      data.rails ?? 3,
      !!data.decryptMode
    )
  }, [data])

  useEffect(() => {
    setData({ rails, decryptMode })
  }, [rails, decryptMode])

  const shiftLeft = () => {
    setRails(rails - 1)
  }
  const shiftRight = () => {
    setRails(rails + 1)
  }

  return (
    <ModuleNode module={RailFenceCipherModule}>
      <div className={'flex flex-col m-auto gap-2'}>
        <div className="flex items-center mx-auto space-x-2">
          <Checkbox
            checked={data.decryptMode}
            id="reverse"
            onCheckedChange={(e) => setDecryptMode(!decryptMode)}
          />
          <label
            htmlFor="reverse"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Decrypt mode
          </label>
        </div>
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
        <div className={'flex flex-col'}>
          {' '
            .repeat(data.rails ?? 3)
            .split('')
            .map((s, k) => {
              const line = result.linesWithSpan[k]
              return <Label className={'my-auto'}>{line ?? ' '}</Label>
            })}
        </div>
      </div>
    </ModuleNode>
  )
}
