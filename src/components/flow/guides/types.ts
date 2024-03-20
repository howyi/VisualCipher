import { Edge, Node } from 'reactflow'

export type Guide = {
  path: string
  title: string
  information: string
  initialNodes: Node[]
  initialEdges: Edge[]
}
