import React, { useEffect, useState } from 'react'
import { useNodes, useReactFlow, useUpdateNodeInternals } from 'reactflow'

export function useNodeData<T>(
  id: string,
  initialData: T
): [T, React.Dispatch<T>] {
  const [data, setRawData] = useState(initialData)
  const updateNodeInternals = useUpdateNodeInternals()

  const nodes = useNodes()
  const reactFlow = useReactFlow()

  const setData = (newData: T) => {
    reactFlow.setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    )
  }

  React.useEffect(() => {
    if (reactFlow.getNode(id)?.data != data) {
      setRawData(reactFlow.getNode(id)?.data)
    }
  }, [nodes])

  useEffect(() => {
    updateNodeInternals(id)
  }, [data])

  return [data, setData]
}
