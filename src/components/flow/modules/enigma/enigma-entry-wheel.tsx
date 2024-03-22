import React from 'react'
import { NodeProps } from 'reactflow'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {
    rotate: {
      description: "A string of '1's equal to the number of input characters",
    },
  },
} as const satisfies Ports<Data>

export const EnigmaEntryWheelModule: Module<Data, typeof ports> = {
  type: 'enigma_entry_wheel',
  node,
  calculate,
  defaultData: {},
  name: 'Enigma Entry Wheel (ETW, Eintrittwalze)',
  description: `Disk to be placed in front of the Enigma cipher machine scrambler
Outputs a rotation with each text entry`,
  ports,
}

function calculate({
  node,
  inputs,
}: ModuleProcessProps<Data, typeof ports>): string {
  return (
    inputs.input
      ?.split('')
      .map(() => '1')
      .join('') ?? ''
  )
}

function node({}: NodeProps<Data>) {
  return <ModuleNode module={EnigmaEntryWheelModule}></ModuleNode>
}
