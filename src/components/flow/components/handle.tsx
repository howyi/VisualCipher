import React, { ReactNode, useMemo } from 'react'
import {
  getConnectedEdges,
  Handle,
  Node,
  Position,
  useEdges,
  useNodeId,
  useNodes,
} from 'reactflow'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'
import { ModuleData } from '@/components/flow/components/module-node'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SIDE_OPTIONS } from '@radix-ui/react-popper'
import {
  DoubleArrowDownIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DoubleArrowUpIcon,
} from '@radix-ui/react-icons'

export function InputHandle({
  id,
  className,
  position,
  description,
}: {
  id?: string
  className?: ClassValue
  position: Position
  description?: ReactNode
}) {
  const nodes = useNodes()
  const edges = useEdges()
  const nodeId = useNodeId()
  const handleId = id ?? 'input'

  const isHandleConnectable = useMemo(() => {
    const node = nodes.find((node) => node.id === nodeId) as Node<ModuleData>
    const connectedEdges = getConnectedEdges([node], edges)
    return (
      connectedEdges.filter(
        (e) => e.target === nodeId && e.targetHandle === handleId
      ).length < 1
    )
  }, [nodes, edges, nodeId])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Handle
            type="target"
            isConnectable={isHandleConnectable}
            id={handleId}
            position={position}
            className={cn(
              PositionToMargin(position),
              'border-2 border-muted-foreground rounded-md py-1 px-2 bg-background',
              className
            )}
          >
            <span
              className={
                'flex flex-row pointer-events-none text-muted-foreground font-extralight text-xs'
              }
            >
              {PositionToIcon('in', position)}
              {id ?? 'in'}
            </span>
          </Handle>
        </TooltipTrigger>
        {description && (
          <TooltipContent side={PositionToSide(position)}>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

function PositionToMargin(position: Position): ClassValue {
  if (position == Position.Top) return '-mt-2'
  if (position == Position.Bottom) return '-mb-2'
  if (position == Position.Left) return ''
  if (position == Position.Right) return ''
  throw Error('side not found')
}

function PositionToSide(position: Position): (typeof SIDE_OPTIONS)[number] {
  if (position == Position.Top) return 'top'
  if (position == Position.Bottom) return 'bottom'
  if (position == Position.Left) return 'left'
  if (position == Position.Right) return 'right'
  throw Error('side not found')
}

function PositionToIcon(type: 'in' | 'out', position: Position): ReactNode {
  const isIn = type == 'in'
  if (position == Position.Top) return isIn ? <DoubleArrowDownIcon /> : <DoubleArrowUpIcon />
  if (position == Position.Bottom) return  isIn ? <DoubleArrowUpIcon /> : <DoubleArrowDownIcon />
  if (position == Position.Left) return  isIn ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />
  if (position == Position.Right) return  isIn ? <DoubleArrowLeftIcon /> : <DoubleArrowRightIcon />
  throw Error('side not found')
}

export function OutputHandle({
  id,
  className,
  position,
  description,
}: {
  id?: string
  className?: ClassValue
  position: Position
  description?: ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Handle
            type="source"
            id={id ?? 'output'}
            position={position}
            className={cn(
              PositionToMargin(position),
              'border-2 border-muted-foreground rounded-md py-1 px-2 bg-muted-foreground',
              className
            )}
          >
            <span
              className={
                'flex flex-row pointer-events-none text-background font-extralight text-xs'
              }
            >
              {PositionToIcon('out', position)}
              {id ?? 'out'}
            </span>
          </Handle>
        </TooltipTrigger>
        {description && (
          <TooltipContent side={PositionToSide(position)}>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
