import { Edge, Node } from 'reactflow'
import { nanoid } from 'nanoid'
import { Guide } from '@/components/flow/guides/types'

const DECRYPTER_OFFSET = 300

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'input',
    data: {
      value: 'ATTACKATDAWN',
      isPlaying: true,
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '1',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 0, y: 500 },
  },
  {
    id: '2',
    type: 'caesar',
    data: { shift: 13 },
    position: { x: -100, y: 250 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: DECRYPTER_OFFSET, y: 500 },
  },
  {
    id: '5',
    type: 'caesar',
    data: { shift: 13 },
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

const information = `# Caesar cipher
Caesar cipher is a classic encryption technique that encrypts a document by shifting a certain number of letters in the alphabet. The basis of this technique is to shift each letter of the plaintext forward or backward a certain number of letters on the alphabet. Decryption involves moving the same number of letters in the opposite direction of the shift made in encryption.

## Encryption Method
1. Select the number of shifts: First, determine the number of alphabetic shifts. For example, if the number of shifts is 3, 'A' becomes 'D' and 'B' becomes 'E'.

2. Text Encryption: Shifts each character of the plaintext alphabetically by the selected number of shifts and replaces it with a new character. If the end of the alphabet is reached, it returns to the beginning of the alphabet.

## Decryption Method
1. Apply Shift Number: Apply the number of shifts used for encryption in reverse order.

2. Text Decryption: Shifts each character of the ciphertext backward in alphabetical order by the selected number of shifts, restoring the original plaintext.

# ROT13
ROT13 is a type of Caesar cipher with a fixed number of shifts of 13.  
With this number of shifts, the encryption and decryption operations are the same.  
In other words, applying ROT13 twice to any text restores the original text; ROT13 is often used to lightly conceal text content (e.g., to hide spoilers or offensive content) rather than to encrypt it.   
For example, applying ROT13 to 'HELLO' will result in 'MURYYY', and applying ROT13 again will result in the original 'HELLO'.

Although ROT13 is easily deciphered and not suitable for security purposes, it is often used as an interesting example to learn the basics of programming and cryptography.
`

export const Caesar: Guide = {
  information,
  initialEdges,
  initialNodes,
  path: '/guides/caesar',
  title: 'Guides/Caesar cipher',
}
