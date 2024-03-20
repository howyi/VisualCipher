import { Edge, Node } from 'reactflow'
import { nanoid } from 'nanoid'
import { Guide } from '@/components/flow/guides/index'

const DECRYPTER_OFFSET = 500

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
    position: { x: 0, y: 1000 },
  },
  {
    id: '2',
    type: 'vigenere',
    data: { key: 'LEMON', decryptMode: false },
    position: { x: -100, y: 250 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: DECRYPTER_OFFSET, y: 1000 },
  },
  {
    id: '5',
    type: 'vigenere',
    data: { key: 'LEMON', decryptMode: true },
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

const information = `# Vigenère cipher
The Vigenel cipher is a type of polyalphabetic cipher named after Blaise de Vigenère, a 16th century French cryptographer. This encryption method uses multiple Caesar cipher shifts to encrypt a single text, creating a cipher that is more difficult to decipher than a cipher based on a single shift.

## Encryption Method
Keyword Selection: The Vigenere cipher requires the same keyword for the encryption and decryption processes. This keyword can be an arbitrary string of the same length or shorter than the text to be encrypted.

1. Repeat Keyword: If the keyword is shorter than the text, the keyword is repeated to match the length of the text.

2. Alphabetic Shift: Each character of the text is transformed according to the amount of shift on the alphabet indicated by the corresponding character of the keyword. For example, if the keyword letter is 'A', the shift is 0, 'B' is 1, and so on.

3. Ciphertext generation: Each character of the text is transformed according to the above shift to generate a new string (ciphertext).

## Decryption Method
Decryption is the reverse process of encryption.

1. Keyword Preparation: Prepare the same keywords used for encryption.

2. Keyword repetition: Repeat the keywords as necessary to match the length of the ciphertext.

3. Reverse Alphabetic Shift: Shifts each letter of the ciphertext in the opposite direction of the amount of shift on the alphabet indicated by the corresponding letter of the keyword. For example, if the shift by the letter of the keyword was 1, a shift of -1 is applied in decryption.
  
In the Vigenere cipher, the more random and long the keywords are, and the longer they are the same length as the text, the more difficult it is to decipher. This provides a higher degree of security, but keyword management is critical.
`

export const Vigenere: Guide = {
  information,
  initialEdges,
  initialNodes,
  path: '/guides/vigenere',
  title: 'Guides/Vigenère cipher',
}
