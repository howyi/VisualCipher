import React from 'react'
import { NodeProps } from 'reactflow'
import {
  getOutput,
  ModuleProps,
  NodeProcess,
} from '@/components/flow/node-types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { getIncomersWithHandle } from '@/components/flow/utils/get-incomers-with-handle'

export type EnigmaEntryWheelData = {}

export const EnigmaEntryWheelProcess: NodeProcess<EnigmaEntryWheelData> = (
  node,
  params,
  inputs
) => {
  return inputs.input?.split('').map(() => '1').join('') ?? ''
}

export const EnigmaEntryWheelModule: ModuleProps<EnigmaEntryWheelData> = {
  type: 'enigma_entry_wheel',
  node: EnigmaEntryWheel,
  process: EnigmaEntryWheelProcess,
  defaultData: {},
  name: 'Enigma Entry Wheel (ETW, Eintrittwalze)',
  description: `Disk to be placed in front of the Enigma cipher machine scrambler
Outputs a rotation with each text entry`,
  ports: {
    in: {
      input: {}
    },
    out : {
      rotate: {
        description: "A string of '1's equal to the number of input characters",
      }
    }
  },
}

export function EnigmaEntryWheel({}: NodeProps<EnigmaEntryWheelData>) {
  return <ModuleNode label="Enigma Entry Wheel"></ModuleNode>
}
