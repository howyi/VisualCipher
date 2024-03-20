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

export type ModuleProcess<T, K extends string | number | symbol = string> = (
  node: NodeWithSourceHandle<T>,
  params: ResolveBaseParams,
  inputs: Inputs<K>
) => string

type Port = {
  position?: Position
  className?: ClassValue
  description?: ReactNode
}

export type Module<T = any> = {
  type: string
  node: (node: NodeProps<T>) => React.JSX.Element
  process: ModuleProcess<T>
  defaultData: T
  name: string
  description: string
  ports: {
    in: { [id in string]: Port }
    out: { [id in string]: Port }
  }
}
