import { Edge, Node } from 'reactflow'
import { nanoid } from 'nanoid'
import { Guide } from '@/components/flow/guides/types'

const DECRYPTER_OFFSET = 300

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'input',
    data: {
      value: 'RAILFENCECIPHER',
      isPlaying: true,
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '1',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: -100, y: 550 },
  },
  {
    id: '2',
    type: 'rail_fence_cipher',
    data: { rails: 3, decryptMode: false },
    position: { x: -100, y: 250 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: DECRYPTER_OFFSET, y: 550 },
  },
  {
    id: '5',
    type: 'rail_fence_cipher',
    data: { rails: 3, decryptMode: true },
    position: { x: -100 + DECRYPTER_OFFSET, y: 250 },
  },
]

const initialEdges: Edge[] = [
  {
    id: nanoid(),
    source: '0',
    sourceHandle: 'output',
    target: '2',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '2',
    sourceHandle: 'output',
    target: '1',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '2',
    sourceHandle: 'output',
    target: '5',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '5',
    sourceHandle: 'output',
    target: '4',
    targetHandle: 'input',
  },
]

const information = `# Rail fence cipher
Rail Fence Cipher is a simple method of encryption and decryption in which text is placed along a waveform (zigzag pattern) that travels downward and upward while writing diagonally, and then read line by line.

### Encryption Method
1. Determine the number of rails (rows): First, determine how many rows (rails) you want to encrypt the text. This is the key.

2. Create a wave pattern: Write the text to be encrypted in a zigzag pattern according to the number of rails you have determined. Start from the top down, and when you reach the bottom, change direction and go back up. This is repeated until the end of the text.

3. Generate cipher text: The text written on each rail is read from the top and concatenated to generate the cipher text.

### Decryption Method
1. Use the number of rails: Start the decryption process based on the number of rails used for encryption.

2. Estimate the wave pattern: Estimates the wave pattern with which the original text was arranged based on the length of the ciphertext and the number of rails.

3. Placing the ciphertext: Places the ciphertext on the rails according to the estimated waveform pattern.

4. Plain text reading: Recovers the original text (plain text) by reading the characters along the zigzag pattern.
`

export const Rail: Guide = {
  information,
  initialEdges,
  initialNodes,
  path: '/guides/rail',
  title: 'Guides/Rail fence cipher',
}
