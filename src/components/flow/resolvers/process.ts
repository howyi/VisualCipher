import { Edge, getOutgoers, Node } from 'reactflow'
import {
  Inputs,
  NodeWithSourceHandle,
  ResolveBaseParams,
} from '@/components/flow/modules/types'
import { RegisteredModules } from '@/components/flow/modules'

export const process = (params: ResolveBaseParams): void => {
  const terminalNodes = getAllTerminalNodes(params.nodes, params.edges)
  for (let node of Object.values(terminalNodes)) {
    startNodeProcess(node, params)
  }
}

const startNodeProcess = (node: Node, params: ResolveBaseParams): string => {
  if (node.type && RegisteredModules[node.type]) {
    const inputs = getInputs(node, params)
    params.updateNodeData(node, {
      inputs,
    })
    return RegisteredModules[node.type].process({
      node,
      portId: '',
      inputs,
    })
  }
  return ''
}

const getAllTerminalNodes = (
  nodes: Node[],
  edges: Edge[]
): { [nodeId in string]: Node } => {
  let foundTerminalNodes: Node[] = []
  for (const node of nodes) {
    foundTerminalNodes.push(...getTerminalNodes(node, nodes, edges))
  }
  const result: { [nodeId in string]: Node } = {}
  for (let foundTerminalNode of foundTerminalNodes) {
    result[foundTerminalNode.id] = foundTerminalNode
  }
  return result
}

const getTerminalNodes = (node: Node, nodes: Node[], edges: Edge[]): Node[] => {
  const ougoers = getOutgoers(node, nodes, edges)
  if (ougoers.length == 0) {
    return [node]
  }
  const terminalNodes: Node[] = []
  for (let outNode of ougoers) {
    terminalNodes.push(...getTerminalNodes(outNode, nodes, edges))
  }
  return terminalNodes
}

function getInputs(node: Node, params: ResolveBaseParams): Inputs {
  const allInputNodes: { [handleId in string]: NodeWithSourceHandle<any> } = {}
  for (let edge of params.edges) {
    if (edge.target !== node.id || !edge.targetHandle || !edge.sourceHandle) {
      continue
    }
    const foundNode = params.nodes.find((n) => n.id === edge.source)
    if (!foundNode) continue
    allInputNodes[edge.targetHandle] = {
      ...foundNode,
      sourceHandleId: edge.sourceHandle,
    }
  }

  const inputs: Inputs = {}
  for (let handleId of Object.keys(allInputNodes)) {
    inputs[handleId] = getOutput(allInputNodes[handleId], params)
  }
  return inputs
}

const getOutput = (
  node: NodeWithSourceHandle<any>,
  params: ResolveBaseParams
): string => {
  if (node.type && RegisteredModules[node.type]) {
    try {
      const inputs = getInputs(node, params)
      params.updateNodeData(node, {
        inputs,
      })
      const out = RegisteredModules[node.type].process({
        node,
        portId: node.sourceHandleId,
        inputs,
      })
      params.updateNodeData(node, {
        error: '',
      })
      return out
    } catch (e: any) {
      params.updateNodeData(node, {
        error: e.message,
      })
    }
  }
  return ''
}
