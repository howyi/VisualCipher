import { Node } from 'reactflow'
import { getOutput, Inputs, ResolveBaseParams } from '@/components/flow/node-types'
import { NodeWithSourceHandle } from '@/components/flow/utils/get-incomers-with-handle'

export function getInputs(
  node: Node,
  params: ResolveBaseParams,
): Inputs {
  const allInputNodes: { [handleId in string]: NodeWithSourceHandle<any> } = {}
  for (let edge of params.edges) {
    if (edge.target !== node.id || !edge.targetHandle || !edge.sourceHandle) {
      continue
    }
    const foundNode = params.nodes.find((n) => n.id === edge.source)
    if (!foundNode) continue
    allInputNodes[edge.targetHandle] = { ...foundNode, sourceHandleId: edge.sourceHandle }
  }

  const inputs: Inputs = {}
  for (let handleId of Object.keys(allInputNodes)) {
    inputs[handleId] = getOutput(allInputNodes[handleId], params)
  }
  return inputs
}
