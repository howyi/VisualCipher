import { Edge, getOutgoers, Node } from 'reactflow'
import {
  Inputs,
  NodeWithSourceHandle,
  ResolveBaseParams,
} from '@/components/flow/modules/types'
import { RegisteredModules } from '@/components/flow/modules'

export const calculate = (params: ResolveBaseParams): void => {
  const terminalNodes = getAllTerminalNodes(params.nodes, params.edges)
  for (let node of Object.values(terminalNodes)) {
    startNodeProcess(node, params)
  }
}

const startNodeProcess = (node: Node, params: ResolveBaseParams): string => {
  return getOutput({ ...node, sourceHandleId: '' }, params)
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
  const value = params.getNodeOutputCache(node.id, node.sourceHandleId)
  if (value !== undefined) {
    return value
  }
  if (node.type && RegisteredModules[node.type]) {
    try {
      const module = RegisteredModules[node.type]
      const inputs = getInputs(node, params)
      for (let key of Object.keys(module.ports.in)) {
        const port = module.ports.in[key]
        const input = inputs[key]
        if (!port || !input) {
          continue
        }
        if (!port.validate) {
          continue
        }
        const validated = port.validate(node.data).safeParse(input)
        if (!validated.success) {
          throw new Error(
            key + ': ' + validated.error.errors.map((e) => e.message).join(',')
          )
        }
      }
      params.updateNodeInputs(node, inputs)
      const out = module.calculate({
        node,
        portId: node.sourceHandleId,
        inputs,
        setResult: (result) => {
          params.updateNodeResult(node, result)
        },
      })
      params.setNodeOutputCache(node.id, node.sourceHandleId, out)
      params.updateNodeError(node, '')
      return out
    } catch (e: any) {
      params.setNodeOutputCache(node.id, node.sourceHandleId, '')
      params.updateNodeError(node, e.message)
    }
  }
  return ''
}
