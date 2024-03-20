import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Edge, Node } from 'reactflow'
import { nanoid } from 'nanoid'
import { FlowTemplate } from '@/components/templates/flow'

const INPUT_NODE = {
  id: '1',
  type: 'input',
  data: {
    value: 'VISUALCIPHER',
    isPlaying: true,
  },
  position: { x: 250, y: 0 },
}
const OUTPUT_NODE = {
  id: '2',
  type: 'output',
  data: { label: 'Output Node' },
  position: { x: 100, y: 900 },
}

const initialNodes: Node<any>[] = [
  INPUT_NODE,
  OUTPUT_NODE,
  {
    id: '3',
    type: 'caesar',
    data: { shift: 3 },
    position: { x: 100, y: 350 },
  },
  {
    id: '4',
    type: 'caesar',
    data: { shift: -3 },
    position: { x: 100, y: 550 },
  },
  {
    id: '5',
    type: 'vigenere',
    data: { key: 'LEMON' },
    position: { x: 700, y: 350 },
  },
  {
    id: '6',
    type: 'output',
    data: {},
    position: { x: 800, y: 1100 },
  },
  {
    id: '7',
    type: 'prefix',
    data: {},
    position: { x: 0, y: 750 },
  },
  {
    id: '8',
    type: 'input',
    data: { value: 'PRE ' },
    position: { x: -200, y: 400 },
  },
  {
    id: '9',
    type: 'output',
    data: {},
    position: { x: -100, y: 1100 },
  },
  {
    id: '10',
    type: 'character_counter',
    data: {},
    position: { x: 400, y: 300 },
  },
  {
    id: '11',
    type: 'word_counter',
    data: {},
    position: { x: -400, y: 350 },
  },
]

const initialEdges: Edge<any>[] = [
  {
    id: nanoid(),
    source: INPUT_NODE.id,
    sourceHandle: 'output',
    target: '3',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '3',
    sourceHandle: 'output',
    target: '4',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '4',
    sourceHandle: 'output',
    target: OUTPUT_NODE.id,
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: INPUT_NODE.id,
    sourceHandle: 'output',
    target: '5',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '5',
    sourceHandle: 'output',
    target: '6',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '4',
    sourceHandle: 'output',
    target: '7',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '8',
    sourceHandle: 'output',
    target: '7',
    targetHandle: 'prefix',
  },
  {
    id: nanoid(),
    source: '7',
    sourceHandle: 'output',
    target: '9',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '1',
    sourceHandle: 'output',
    target: '10',
    targetHandle: 'input',
  },
  {
    id: nanoid(),
    source: '1',
    sourceHandle: 'output',
    target: '11',
    targetHandle: 'input',
  },
]

const INFO = `
# VisualCipher Playground
This service is a platform that allows users to directly experience visually the various encryption and decryption mechanisms in history.    
created by [@howyi_lq](https://twitter.com/howyi_lq).  

Drag and drop cipher modules together and explore the fascinating world of ciphers from ancient to modern times.
## Features:
### Wide range of encryption and decryption experiences
freely manipulate encryption technologies through the ages, starting with the Caesar cipher and ending with the complex Enigma cipher machine.

### Real-time text highlighting
Input text is highlighted in real-time, bringing each encryption and decryption process to life before your eyes.

### In-browser data saving
All editing operations in "VisualCipher Playground" are saved in the browser, so you can stop working at any time and continue later.

### Easy addition of modules
You can further extend your encryption experience by adding new cipher modules via the button in the lower right corner.

### Fully client-side
All processing is done on the client side, with no communication with the server. Privacy and security are preserved.

### Open-source
VisualCipher is developed as an open source project and the source code is available on GitHub. New modules and feature improvement commits by the community are welcome.

---

VisualCipher provides a place where you can easily learn and experiment with the history of cryptography. Through this platform, you too can experience the magic of the world of cryptography.
`

const IndexPage: React.FC<PageProps> = () => {
  return (
    <FlowTemplate
      title={'Playground'}
      nodes={initialNodes}
      edges={initialEdges}
      storageKey={'tmp'}
      information={INFO}
    />
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>VisualCipher</title>
