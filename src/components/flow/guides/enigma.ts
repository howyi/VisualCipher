import { Edge, Node } from 'reactflow'
import { nanoid } from 'nanoid'
import { Guide } from '@/components/flow/guides/index'

const SCRAMBLER_Y = 0
const SCRAMBLER_X = -400
const SCRAMBLER_INTERFACE_Y = SCRAMBLER_Y + 700
const SCRAMBLER_INTERFACE_Y_REVERSE = SCRAMBLER_INTERFACE_Y + 350
const SCRAMBLER_X_OFFSET = -400

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'input',
    data: {
      value: 'BSGCEOJRRKCT',
      isPlaying: true,
    },
    position: { x: 250, y: -200 },
  },
  {
    id: '1',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 600, y: 0 },
  },
  {
    id: '15',
    type: 'input',
    data: { value: 'AB SZ UY GH LQ EN' },
    position: { x: 550, y: 600 },
  },
  {
    id: '2',
    type: 'enigma_plug_board',
    data: {},
    position: { x: -50, y: 500 },
  },
  {
    id: '3',
    type: 'enigma_plug_board',
    data: {},
    position: { x: 100, y: 1000 },
  },
  {
    id: '4',
    type: 'enigma_entry_wheel',
    data: {},
    position: { x: -50, y: 0 },
  },
  {
    id: '5',
    type: 'enigma_scrambler',
    data: {
      wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
      notch: 'V',
      mapType: 'TOP',
    },
    position: { x: SCRAMBLER_X, y: SCRAMBLER_Y },
  },
  {
    id: '6',
    type: 'enigma_scrambler_interface',
    data: {},
    position: { x: SCRAMBLER_X, y: SCRAMBLER_INTERFACE_Y },
  },
  {
    id: '7',
    type: 'enigma_scrambler_interface',
    data: {
      reverse: true,
    },
    position: { x: SCRAMBLER_X, y: SCRAMBLER_INTERFACE_Y_REVERSE },
  },
  {
    id: '8',
    type: 'enigma_scrambler',
    data: {
      wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
      notch: 'E',
      mapType: 'TOP',
    },
    position: { x: SCRAMBLER_X + SCRAMBLER_X_OFFSET, y: SCRAMBLER_Y },
  },
  {
    id: '9',
    type: 'enigma_scrambler_interface',
    data: {},
    position: { x: SCRAMBLER_X + SCRAMBLER_X_OFFSET, y: SCRAMBLER_INTERFACE_Y },
  },
  {
    id: '10',
    type: 'enigma_scrambler_interface',
    data: {
      reverse: true,
    },
    position: {
      x: SCRAMBLER_X + SCRAMBLER_X_OFFSET,
      y: SCRAMBLER_INTERFACE_Y_REVERSE,
    },
  },
  {
    id: '11',
    type: 'enigma_scrambler',
    data: {
      wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
      notch: 'Q',
      mapType: 'TOP',
    },
    position: {
      x: SCRAMBLER_X + SCRAMBLER_X_OFFSET + SCRAMBLER_X_OFFSET,
      y: SCRAMBLER_Y,
    },
  },
  {
    id: '12',
    type: 'enigma_scrambler_interface',
    data: {},
    position: {
      x: SCRAMBLER_X + SCRAMBLER_X_OFFSET + SCRAMBLER_X_OFFSET,
      y: SCRAMBLER_INTERFACE_Y,
    },
  },
  {
    id: '13',
    type: 'enigma_scrambler_interface',
    data: {
      reverse: true,
    },
    position: {
      x: SCRAMBLER_X + SCRAMBLER_X_OFFSET + SCRAMBLER_X_OFFSET,
      y: SCRAMBLER_INTERFACE_Y_REVERSE,
    },
  },
  {
    id: '14',
    type: 'enigma_reflector',
    data: {
      wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    },
    position: {
      x:
        SCRAMBLER_X +
        SCRAMBLER_X_OFFSET +
        SCRAMBLER_X_OFFSET +
        SCRAMBLER_X_OFFSET,
      y: SCRAMBLER_INTERFACE_Y_REVERSE,
    },
  },
  {
    id: '16',
    type: 'replace',
    data: {
      search: ' ',
      replace: 'X',
    },
    position: { x: 0, y: 250 },
  },
  {
    id: '17',
    type: 'to_upper_case',
    data: {},
    position: { x: 250, y: 100 },
  },
]

const initialEdges: Edge[] = [
  {
    id: nanoid(),
    source: '0',
    sourceHandle: 'output',
    target: '17',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '17',
    sourceHandle: 'output',
    target: '16',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '16',
    sourceHandle: 'output',
    target: '2',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '0',
    sourceHandle: 'output',
    target: '4',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '2',
    sourceHandle: 'output',
    target: '6',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '6',
    sourceHandle: 'output',
    target: '9',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '9',
    sourceHandle: 'output',
    target: '12',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '12',
    sourceHandle: 'output',
    target: '14',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '14',
    sourceHandle: 'output',
    target: '13',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '13',
    sourceHandle: 'output',
    target: '10',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '10',
    sourceHandle: 'output',
    target: '7',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '7',
    sourceHandle: 'output',
    target: '3',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '3',
    sourceHandle: 'output',
    target: '1',
    targetHandle: 'input',
  },

  {
    id: nanoid(),
    source: '4',
    sourceHandle: 'rotate',
    target: '5',
    targetHandle: 'rotate',
  },
  {
    id: nanoid(),
    source: '5',
    sourceHandle: 'rotate',
    target: '8',
    targetHandle: 'rotate',
  },
  {
    id: nanoid(),
    source: '8',
    sourceHandle: 'rotate',
    target: '11',
    targetHandle: 'rotate',
  },

  {
    id: nanoid(),
    source: '5',
    sourceHandle: 'scrambler',
    target: '6',
    targetHandle: 'scrambler',
  },
  {
    id: nanoid(),
    source: '5',
    sourceHandle: 'scrambler',
    target: '7',
    targetHandle: 'scrambler',
  },
  {
    id: nanoid(),
    source: '8',
    sourceHandle: 'scrambler',
    target: '9',
    targetHandle: 'scrambler',
  },
  {
    id: nanoid(),
    source: '8',
    sourceHandle: 'scrambler',
    target: '10',
    targetHandle: 'scrambler',
  },
  {
    id: nanoid(),
    source: '11',
    sourceHandle: 'scrambler',
    target: '12',
    targetHandle: 'scrambler',
  },
  {
    id: nanoid(),
    source: '11',
    sourceHandle: 'scrambler',
    target: '13',
    targetHandle: 'scrambler',
  },

  {
    id: nanoid(),
    source: '15',
    sourceHandle: 'output',
    target: '2',
    targetHandle: 'plugs',
  },
  {
    id: nanoid(),
    source: '15',
    sourceHandle: 'output',
    target: '3',
    targetHandle: 'plugs',
  },
]

const information = `
# Enigma Emulator
This page uses [VisualCipher](https://howyi.github.io/visualcipher/) to digitally visualize and reproduce a 3-rotor model of Enigma, the famous cryptographic machine used by Nazi Germany during World War II.  
The Enigma is known for its unique structure and complex encryption process, and through this emulator, users can actually experience the behavior of the plugboard, scrambler, and reflector.

※You can add and delete modules on this page, but the settings you create are not saved. If you wish to save your work, please use the [VisualCipher Playground](https://howyi.github.io/visualcipher/) .


## Features
### Plugboard
Input must be provided in string format with a space per character (e.g. [AB CD] will convert A to B and B to A).
### Scramblers and Reflectors
Real scramblers and reflectors are available through the template selection. It is also possible to implement original scramblers (and reflectors) by writing directly in the wiring field.

## How it works: 
The Enigma Entry Wheel is connected to the rightmost Scrambler and rotates with each input. The non-rightmost Scrambler rotates only when the Scrambler to its own right passes the Notch.
### Wiring settings:
#### MappingType 
wiring has TOP (major notation) and BOTTOM (notation that specifies the letter to wire to);
#### Ring
represents the wiring when the scrambler is placed 
#### Position
sets the initial position of the scrambler.

`

export const Enigma: Guide = {
  information,
  initialEdges,
  initialNodes,
  path: '/guides/enigma',
  title: 'Guides/Enigma Emulator',
}
