import { NodeResizer, useNodeId, useUpdateNodeInternals } from 'reactflow'
import React from 'react'

export function Resizer({ id, selected }: { id: string; selected: boolean }) {
  const updateNodeInternals = useUpdateNodeInternals()

  return (
    <NodeResizer
      color="#555555"
      isVisible={selected}
      minWidth={200}
      minHeight={100}
      onResize={() => {
        updateNodeInternals(id)
      }}
    />
  )
}
