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
import { Inputs, Module } from '@/components/flow/modules/types'

export type ModuleData = {
  error?: string
  inputs?: Inputs
}

export function ModuleNode({
  module,
  label,
  className,
  informationMarkdown,
  children,
}: {
  module: Module
  label?: ReactNode
  className?: ClassValue
  informationMarkdown?: string
} & PropsWithChildren) {
  const nodes = useNodes()
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()
  const node = useMemo(() => {
    return nodes.find((node) => node.id === nodeId) as Node<ModuleData>
  }, [nodes, nodeId])

  function deleteNode() {
    reactFlow.setNodes((nds) => nds.filter((node) => node.id !== nodeId))
  }

  return (
    <>
      <NodeToolbar position={Position.Left}>
        <Button size={'sm'} variant={'destructive'} onClick={deleteNode}>
          <TrashIcon />
        </Button>
      </NodeToolbar>
      <HoverCard open={(node?.data?.error ?? '') != ''}>
        <HoverCardTrigger>
          <div
            className={cn(
              'notranslate font-mono whitespace-pre px-4 py-6 shadow-md rounded-md bg-background text-foreground border-2 border-muted-foreground node-card',
              className
            )}
          >
            <div className={'text-muted-foreground flex flex-row gap-2 pb-2'}>
              <div className={'flex-1'}>
                <div className={'w-full'}>{label ?? module.name}</div>
              </div>
              <div className={'my-auto'}>
                {module.description && (
                  <InformationIcon information={module.description} />
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
          {node?.data?.error}
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
