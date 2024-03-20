import React from 'react'
import { NodeProps } from 'reactflow'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'

export type EnigmaEntryWheelData = {}

export const EnigmaEntryWheelProcess: ModuleProcess<EnigmaEntryWheelData> = (
  node,
  params,
  inputs
) => {
  return inputs.input?.split('').map(() => '1').join('') ?? ''
}

export const EnigmaEntryWheelModule: Module<EnigmaEntryWheelData> = {
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
  return <ModuleNode module={EnigmaEntryWheelModule}></ModuleNode>
}
