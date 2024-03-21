import React, { ReactNode } from 'react'
import { Edge, Node, NodeProps, Position } from 'reactflow'
import { ClassValue } from 'clsx'

export type NodeWithSourceHandle<T> = Node<T> & {
  sourceHandleId: string
}

export type ResolveBaseParams = {
  updateNodeData: (node: Node, newData: any) => void
  nodes: Node[]
  edges: Edge[]
}

export type Inputs<T extends string | number | symbol = string> = {
  [handleId in T]: string | undefined
}

export type ModuleNode = (node: NodeProps<any>) => React.JSX.Element

export type ModuleProcessProps<T, K extends Ports> = {
  node: Node<T>
  portId: keyof K['out']
  inputs: Inputs<keyof K['in']>
}

type ModuleProcess<T, K extends Ports> = (
  props: ModuleProcessProps<T, K>
) => string

type Port = {
  position?: Position
  className?: ClassValue
  description?: ReactNode
}

export type Ports = {
  in: { [portId in string]: Port }
  out: { [portId in string]: Port }
}

export type Module<T, K extends Ports> = {
  type: string
  node: (node: NodeProps<T>) => React.JSX.Element
  process: ModuleProcess<T, K>
  defaultData: T
  name: string
  description: string
  ports: Ports
}
