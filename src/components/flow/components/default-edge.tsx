import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from 'reactflow'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'

const onEdgeClick = (evt: any, id: any) => {
  evt.stopPropagation()
  alert(`remove ${id}`)
}

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className={'nodrag nopan '}
        >
          {selected && (
            <Button
              variant={'destructive'}
              size={'sm'}
              className="edgebutton"
              onClick={onEdgeClick}
            >
              <TrashIcon />
            </Button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
