import React, { ReactNode } from 'react'
import { Edge, Node, NodeProps, Position } from 'reactflow'
import { ClassValue } from 'clsx'
import { ZodType } from 'zod/lib/types'

export type NodeWithSourceHandle<T> = Node<T> & {
  sourceHandleId: string
}

export type ResolveBaseParams = {
  updateNodeData: (node: Node, newData: any) => void
  updateNodeInputs: (nodeId: Node, newInputs: Inputs) => void
  updateNodeError: (nodeId: Node, newError?: string) => void
  updateNodeResult: (nodeId: Node, newResult?: Result) => void
  nodes: Node[]
  edges: Edge[]
}

export type Inputs<T extends string | number | symbol = string> = {
  [handleId in T]: string | undefined
}

export type Result = any

export type ModuleNode = (node: NodeProps<any>) => React.JSX.Element

export type ModuleProcessProps<
  T,
  K extends Ports<T>,
  R extends Result = undefined,
> = {
  node: Node<T>
  portId: keyof K['out']
  inputs: Inputs<keyof K['in']>
  setResult: (result: R) => void
}

type ModuleCalculate<T, K extends Ports<T>, R extends Result = undefined> = (
  props: ModuleProcessProps<T, K, R>
) => string

type Port = {
  position?: Position
  className?: ClassValue
  description?: ReactNode
}

type InputPort<T> = Port & {
  validate?: (data: T) => ZodType
}

export type Ports<T> = {
  in: { [portId in string]: InputPort<T> }
  out: { [portId in string]: Port }
}

export type Module<T, K extends Ports<T>, R extends Result = undefined> = {
  type: string
  node: (node: NodeProps<T>) => React.JSX.Element
  calculate: ModuleCalculate<T, K, R>
  defaultData: T
  name: string
  description: string
  ports: Ports<T>
}
