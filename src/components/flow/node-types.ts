import React, { ReactNode } from 'react'
import { Edge, getOutgoers, Node, NodeProps, Position } from 'reactflow'
import { ClassValue } from 'clsx'
import { RegisteredModules } from '@/components/flow/modules'
import { NodeWithSourceHandle } from '@/components/flow/utils/get-incomers-with-handle'
import { getInputs } from '@/components/flow/utils/get-inputs'

export type ResolveBaseParams = {
  updateNodeData: (node: Node, newData: any) => void
  nodes: Node[]
  edges: Edge[]
}

type NodeType = (node: NodeProps<any>) => React.JSX.Element
export type Inputs<T extends string|number|symbol = string> = {
  [handleId in T]: string | undefined
}
export type NodeProcess<T, K extends string|number|symbol = string> = (
  node: NodeWithSourceHandle<T>,
  params: ResolveBaseParams,
  inputs: Inputs<K>
) => string

type HandleProp = {
  position?: Position
  className?: ClassValue
  description?: ReactNode
}

export type ModuleProps<T = any> = {
  type: string
  node: (node: NodeProps<T>) => React.JSX.Element
  process: NodeProcess<T>
  defaultData: T
  name: string
  description: ReactNode
  ports: {
    in: { [id in string]: HandleProp }
    out: { [id in string]: HandleProp }
  }
}

export function useModules(): [
  { [key in string]: ModuleProps },
  { [key in string]: NodeType },
] {
  const nodeTypes = React.useMemo(() => {
    const results: { [key in string]: NodeType } = {}
    for (let type in RegisteredModules) {
      results[type] = RegisteredModules[type].node
    }
    return results
  }, [])
  return [RegisteredModules, nodeTypes]
}

export const getOutput = (
  node: NodeWithSourceHandle<any>,
  params: ResolveBaseParams
): string => {
  if (node.type && RegisteredModules[node.type]) {
    try {
      const inputs = getInputs(node, params)
      params.updateNodeData(node, {
        inputs,
      })
      const out = RegisteredModules[node.type].process(node, params, inputs)
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

export const startNodeProcess = (
  node: Node,
  params: ResolveBaseParams
): string => {
  if (node.type && RegisteredModules[node.type]) {
    const inputs = getInputs(node, params)
    params.updateNodeData(node, {
      inputs,
    })
    return RegisteredModules[node.type].process({ ...node, sourceHandleId: '' }, params, inputs)
  }
  return ''
}

export const getAllTerminalNodes = (
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

export const getTerminalNodes = (
  node: Node,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
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
