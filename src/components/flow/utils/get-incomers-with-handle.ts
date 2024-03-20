import { Edge, Node } from 'reactflow'

export type NodeWithSourceHandle<T> = Node<T> & {
  sourceHandleId: string
}

export function getIncomersWithHandle<T>(
  node: Node<T>,
  nodes: Node[],
  edges: Edge[],
  handleId: string
): NodeWithSourceHandle<T>[] {
  const found: NodeWithSourceHandle<T>[] = []
  for (let edge of edges) {
    if (edge.target !== node.id) {
      continue
    }
    if (edge.targetHandle === handleId) {
      const foundNode = nodes.find((n) => n.id === edge.source)
      if (foundNode) {
        found.push({ ...foundNode, sourceHandleId: edge.sourceHandle ?? '' })
      }
    }
  }
  return found
}
