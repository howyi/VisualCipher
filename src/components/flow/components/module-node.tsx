import React, { PropsWithChildren, ReactNode, useMemo } from 'react'
import {
  Node,
  NodeToolbar,
  Position,
  useNodeId,
  useNodes,
  useReactFlow,
} from 'reactflow'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'
import { InformationIcon } from '@/components/organisms/information-icon'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { InputHandle, OutputHandle } from '@/components/flow/components/handle'
import { Module } from '@/components/flow/modules/types'
import { useNodeState } from '@/components/flow/hooks/use-node-state'

export function ModuleNode({
  module,
  label,
  className,
  children,
}: {
  module: Module<any, any, any>
  label?: ReactNode
  className?: ClassValue
} & PropsWithChildren) {
  const nodes = useNodes()
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()
  const node = useMemo(() => {
    return nodes.find((node) => node.id === nodeId) as Node
  }, [nodes, nodeId])
  const { error } = useNodeState()

  function deleteNode() {
    reactFlow.setEdges((egs) =>
      egs.filter((edge) => edge.target !== nodeId && edge.source !== nodeId)
    )
    reactFlow.setNodes((nds) => nds.filter((node) => node.id !== nodeId))
  }

  return (
    <>
      <NodeToolbar position={Position.Left}>
        <Button size={'sm'} variant={'destructive'} onClick={deleteNode}>
          <TrashIcon />
        </Button>
      </NodeToolbar>
      <HoverCard open={(error ?? '') != ''}>
        <HoverCardTrigger>
          <div
            className={cn(
              'notranslate font-mono whitespace-pre px-4 py-6 shadow-md rounded-md bg-background text-foreground border-2 border-muted-foreground node-card',
              className
            )}
          >
            <div className={'text-muted-foreground flex flex-row gap-2 pb-2'}>
              <div className={'flex-1 overflow-x-hidden'}>
                <div className={'w-full'}>{label ?? module.name}</div>
              </div>
              <div className={'my-auto'}>
                {module.description && (
                  <InformationIcon
                    information={module.name + '\n\n' + module.description}
                  />
                )}
              </div>
            </div>
            {children}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side={'top'}
          className={'bg-destructive w-full mb-4 opacity-90'}
        >
          {error}
        </HoverCardContent>
        {module && (
          <>
            {Object.keys(module.ports.in).map((id) => {
              return (
                <InputHandle
                  id={id}
                  key={id}
                  position={module.ports.in[id].position ?? Position.Top}
                  className={module.ports.in[id].className}
                  description={module.ports.in[id].description}
                />
              )
            })}
            {Object.keys(module.ports.out).map((id) => {
              return (
                <OutputHandle
                  id={id}
                  key={id}
                  position={module.ports.out[id].position ?? Position.Bottom}
                  className={module.ports.out[id].className}
                  description={module.ports.out[id].description}
                />
              )
            })}
          </>
        )}
      </HoverCard>
    </>
  )
}
