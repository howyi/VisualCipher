import React, { useState } from 'react'
import { useNodes, useReactFlow } from 'reactflow'
import { ModuleData } from '@/components/flow/components/module-node'
import { Ports } from '@/components/flow/modules/types'

export function useNodeDataState<T, K extends Ports>(
  id: string,
  initialData: T & ModuleData<K>
): [T & ModuleData<K>, React.Dispatch<T>] {
  const [data, setRawData] = useState(initialData)

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

  return [data, setData]
}
