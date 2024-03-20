import { Edge, Node } from 'reactflow'
import { Enigma } from '@/components/flow/guides/enigma'
import { Vigenere } from '@/components/flow/guides/vigenere'
import { Caesar } from '@/components/flow/guides/caesar'

export type Guide = {
  path: string
  title: string
  information: string
  initialNodes: Node[]
  initialEdges: Edge[]
}

export const RegisteredGuides: Guide[] = [
  Caesar,
  Vigenere,
  Enigma,
]
