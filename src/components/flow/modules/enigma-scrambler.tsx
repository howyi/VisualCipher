import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeProps, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { HeightIcon, ReaderIcon } from '@radix-ui/react-icons'
import { StringShift } from '@/components/flow/utils/string-shift'
import { ALPHABETS } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'

type EnigmaScramblerData = {
  board?: string
  wiring?: string
  mapType?: 'TOP' | 'BOTTOM'
  notch?: string
  ring?: number
  initialPosition?: number
}

type EnigmaScramblerTemplate = {
  name: string
  wiring: string
  notch: string
  mapType: 'TOP' | 'BOTTOM'
}

//  https://en.wikipedia.org/wiki/Enigma_rotor_details#Rotor_wiring_tables
const ScramblerTemplates: EnigmaScramblerTemplate[] = [
  {
    name: 'Enigma I - I',
    wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    notch: 'Q',
    mapType: 'TOP',
  },
  {
    name: 'Enigma I - II',
    wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    notch: 'E',
    mapType: 'TOP',
  },
  {
    name: 'Enigma I - III',
    wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    notch: 'V',
    mapType: 'TOP',
  },
  {
    name: 'M3 Army - IV',
    wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    notch: 'J',
    mapType: 'TOP',
  },
  {
    name: 'M3 Army - V',
    wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    notch: 'Z',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VI',
    wiring: 'JPGVOUMFYQBENHZRDKASXLICTW',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VII',
    wiring: 'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VIII',
    wiring: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: 'CYPHER Ⅰ',
    wiring: 'UWYGADFPVZBECKMTHXSLRINQOJ',
    notch: '',
    mapType: 'BOTTOM',
  },
  {
    name: 'CYPHER Ⅱ',
    wiring: 'AJPCZWRLFBDKOTYUQGENHXMIVS',
    notch: '',
    mapType: 'BOTTOM',
  },
  {
    name: 'CYPHER Ⅲ',
    wiring: 'TAGBPCSDQEUFVNZHYIXJWLRKOM',
    notch: '',
    mapType: 'BOTTOM',
  },
]

const EnigmaScramblerProcess: ModuleProcess<EnigmaScramblerData> = (
  node,
  params,
  inputs
) => {
  if (node.sourceHandleId === 'board') {
    return node.data.board ?? ''
  }
  if (node.sourceHandleId === 'notch') {
    return node.data.notch ?? ''
  }
  if (node.sourceHandleId === 'scrambler') {
    let top = StringShift(
      node.data.wiring ?? '',
      -(node.data.initialPosition ?? 0) + (node.data.ring ?? 0)
    )
    let bottom = StringShift(
      ALPHABETS ?? '',
      -(node.data.initialPosition ?? 0) + (node.data.ring ?? 0)
    )
    if (node.data.mapType === 'BOTTOM') {
      ;[top, bottom] = [bottom, top]
    }
    return JSON.stringify({ top, bottom, rotate: inputs.rotate })
  }
  if (inputs.rotate && node.sourceHandleId === 'rotate') {
    let currentAlphabets = StringShift(
      ALPHABETS ?? '',
      -(node.data.initialPosition ?? 0) + (node.data.ring ?? 0)
    )
    let out = ''
    const notches = node.data.notch?.split('') ?? []
    for (let w of inputs.rotate.split('')) {
      const firstCharacter = currentAlphabets.charAt(0)
      if (w === '1' && notches.includes(firstCharacter)) {
        out += '1'
        currentAlphabets = StringShift(currentAlphabets, -1)
      } else if (w === '1') {
        currentAlphabets = StringShift(currentAlphabets, -1)
        out += '0'
      } else {
        out += '0'
      }
    }
    return out
  }
  return ''
}

export const EnigmaScramblerModule: Module<EnigmaScramblerData> = {
  type: 'enigma_scrambler',
  node: EnigmaScrambler,
  process: EnigmaScramblerProcess,
  defaultData: {
    wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    notch: 'Q',
    mapType: 'TOP',
  },
  name: 'Enigma Scrambler (Rotar, Walzen)',
  description: `Scrambler emulator for Enigma Crypto.
Wiring settings are made, and the current scrambler state is output from {scrambler} when {rotate} is input from the Entry Wheel or the previous Scrambler.
To actually perform conversions using the scrambler, it is necessary to use the Enigma Scrambler Interface.`,
  ports: {
    in: {
      rotate: {
        className: 'ml-16',
        description: 'from Previous Scrambler or Entry Wheel Port',
      },
    },
    out: {
      scrambler: {
        description: 'to Scrambler Interface Port',
      },
      rotate: {
        position: Position.Top,
        className: '-ml-16',
        description: 'to Next Scrambler Port',
      },
    },
  },
}

const getWheelRotation = (rotate: string): number => {
  return (rotate?.match(/1/g) || []).length
}

function EnigmaScrambler({
  id,
  data: initialData,
}: NodeProps<EnigmaScramblerData>) {
  const [nodeData, setNodeData] = useNodeDataState<EnigmaScramblerData>(
    id,
    initialData
  )
  const [wiring, setWiring] = useState(initialData.wiring ?? '')
  const [notch, setNotch] = useState(initialData.notch ?? '')
  const [mapType, setMapType] = useState(initialData.mapType ?? 'TOP')
  const [ring, setRing] = useState(initialData.ring ?? 0)
  const [initialPosition, setInitialPosition] = useState(
    initialData.initialPosition ?? 0
  )
  const wiringLabel = useMemo(() => {
    const found = ScramblerTemplates.find(
      (r) => r.wiring === wiring && r.notch === notch && r.mapType === mapType
    )
    return found ? found.name : 'Custom'
  }, [wiring, notch, mapType])
  const shift = useCallback(StringShift, [])
  const wheelRotation = useMemo(() => {
    return getWheelRotation(nodeData.inputs?.rotate ?? '')
  }, [nodeData.inputs])
  const [
    startTopRotar,
    startBottomRotar,
    currentTopRotar,
    currentBottomRotar,
    topNotch,
    bottomNotch,
  ] = useMemo(() => {
    const startTopRotar = shift(wiring, -initialPosition + ring)
    const topNotch = ''
    const startBottomRotar = shift(ALPHABETS, -initialPosition + ring)
    const bottomNotch = notch
    const currentTopRotar = shift(startTopRotar, -wheelRotation)
    const currentBottomRotar = shift(startBottomRotar, -wheelRotation)
    if (mapType == 'BOTTOM') {
      return [
        startBottomRotar,
        startTopRotar,
        currentBottomRotar,
        currentTopRotar,
        bottomNotch,
        topNotch,
      ]
    }
    return [
      startTopRotar,
      startBottomRotar,
      currentTopRotar,
      currentBottomRotar,
      topNotch,
      bottomNotch,
    ]
  }, [wiring, initialPosition, ring, wheelRotation, notch, mapType])

  useEffect(() => {
    setNodeData({
      ...nodeData,
      wiring,
      notch,
      ring,
      initialPosition,
      mapType,
    })
  }, [wiring, notch, ring, initialPosition, mapType])

  return (
    <ModuleNode module={EnigmaScramblerModule} className={'w-[300px]'}>
      <div className={'flex flex-col gap-4 m-auto'}>
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
              {ScramblerTemplates.map((r) => (
                <DropdownMenuItem
                  key={r.name}
                  onClick={() => {
                    setWiring(r.wiring)
                    setNotch(r.notch)
                    setMapType(r.mapType)
                  }}
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

        <div className={'flex flex-row m-auto w-full gap-1 whitespace-pre'}>
          <Label className={'flex-0 my-auto pl-1'}>MappingType: </Label>
          <Label className={'flex-1 font-bold my-auto pl-1'}>
            {nodeData.mapType}
          </Label>
          <Button
            size={'sm'}
            variant={'outline'}
            className={'flex-0'}
            onClick={() => setMapType(mapType == 'TOP' ? 'BOTTOM' : 'TOP')}
          >
            <HeightIcon />
          </Button>
        </div>

        <div className={'flex flex-row m-auto w-full gap-1 whitespace-pre'}>
          <Label className={'flex-0 my-auto pl-1'}>Notch: </Label>
          <Input
            type="text"
            id="notch"
            placeholder="Notch Characters"
            value={notch}
            onChange={(e) => setNotch(e.target.value)}
          />
        </div>

        <div className={'flex flex-row m-auto w-full gap-1 whitespace-pre'}>
          <Label className={'flex-0 my-auto pl-1'}>Ring: </Label>
          <Button
            disabled={ring === 0}
            onClick={() => setRing(Math.max(ring - 1, 0))}
            className={'flex-0 w-12'}
            variant="outline"
          >
            ←
          </Button>
          <div className={'flex-1 text-center text-xs m-auto'}>
            {ring + 1}{' '}
            <span className={'text-muted-foreground'}>
              {ALPHABETS.charAt(ring)}
            </span>
          </div>
          <Button
            disabled={ring === ALPHABETS.length - 1}
            onClick={() => setRing(Math.min(ring + 1, ALPHABETS.length - 1))}
            className={'flex-0 w-12'}
            variant="outline"
          >
            →
          </Button>
        </div>

        <div className={'flex flex-row m-auto w-full gap-1 whitespace-pre'}>
          <Label className={'flex-0 my-auto pl-1'}>Position: </Label>
          <Button
            disabled={initialPosition === 0}
            onClick={() => setInitialPosition(Math.max(initialPosition - 1, 0))}
            className={'flex-0 w-12'}
            variant="outline"
          >
            ←
          </Button>
          <div className={'flex-1 text-center text-xs m-auto'}>
            {initialPosition + 1}{' '}
            <span className={'text-muted-foreground'}>
              {ALPHABETS.charAt(initialPosition)}
            </span>
          </div>
          <Button
            disabled={initialPosition === ALPHABETS.length - 1}
            onClick={() =>
              setInitialPosition(
                Math.min(initialPosition + 1, ALPHABETS.length - 1)
              )
            }
            className={'flex-0 w-12'}
            variant="outline"
          >
            →
          </Button>
        </div>

        <Separator className={'my-2'} />
        <div className={'flex flex-col m-auto gap-2 font-mono whitespace-pre'}>
          <Label className={'text-center font-bold'}>START ROTAR:</Label>
          <Label className={'my-auto'}>
            <Highlight
              index={undefined}
              text={startTopRotar}
              className={'text-module-input'}
              notch={topNotch}
            />
          </Label>
          <Label className={'my-auto'}>
            <Highlight
              index={undefined}
              text={startBottomRotar}
              notch={bottomNotch}
            />
          </Label>
        </div>
        <Separator className={'my-2'} />
        <div className={'flex flex-col m-auto gap-2 font-mono whitespace-pre'}>
          <Label className={'text-center font-bold'}>CURRENT ROTAR:</Label>
          <Label className={'my-auto'}>
            <Highlight
              index={undefined}
              text={currentTopRotar}
              notch={topNotch}
            />
          </Label>
          <Label className={'my-auto'}>
            <Highlight
              index={undefined}
              text={currentBottomRotar}
              notch={bottomNotch}
            />
          </Label>
        </div>
      </div>
    </ModuleNode>
  )
}
