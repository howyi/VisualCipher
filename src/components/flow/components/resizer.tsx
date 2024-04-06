import { NodeResizer, useNodeId, useUpdateNodeInternals } from 'reactflow'
import React from 'react'

export function Resizer({ id, selected }: { id: string; selected: boolean }) {
  const updateNodeInternals = useUpdateNodeInternals()

  return (
    <NodeResizer
      color="#555555"
      isVisible={selected}
      minWidth={100}
      minHeight={60}
      onResize={() => {
        updateNodeInternals(id)
      }}
    />
  )
}
