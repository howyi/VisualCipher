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
import { Cross1Icon, TrashIcon } from '@radix-ui/react-icons'
import { InformationIcon } from '@/components/organisms/information-icon'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { InputHandle, OutputHandle } from '@/components/flow/components/handle'
import { Module } from '@/components/flow/modules/types'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'

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
      <HoverCard open={(error ?? '') != ''}>
        <HoverCardTrigger>
          <div
            className={cn(
              'notranslate h-full hidden-scrollbar overflow-clip flex flex-col gap-2 font-mono whitespace-pre bg-background text-foreground border-2 border-l-8 border-muted-foreground',
              className,
              node.selected
                ? 'outline outline-offset-2'
                : 'hover:outline-dashed hover:outline-offset-2'
            )}
          >
            <div
              className={
                'flex-0 flex flex-row px-2 pt-2 ' +
                (node.selected ? 'block' : 'invisible')
              }
            >
              <div className={'flex-1'}></div>
              <Button
                className={'flex-0'}
                size={'xs'}
                variant={'ghost'}
                onClick={deleteNode}
              >
                <Cross1Icon />
              </Button>
            </div>
            <ModuleItemContainer
              className={
                'flex-0 text-muted-foreground flex flex-row gap-2 pb-2'
              }
            >
              <div className={'flex-1 overflow-x-hidden text-center'}>
                <div className={'w-full'}>{label ?? module.name}</div>
              </div>
              {/*<div className={'my-auto'}>*/}
              {/*  {module.description && (*/}
              {/*    <InformationIcon*/}
              {/*      information={module.name + '\n\n' + module.description}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</div>*/}
            </ModuleItemContainer>
            <div
              className={cn(
                'flex-1 flex flex-col',
                Object.keys(module.ports.out).length == 0 ? '' : 'pb-8'
              )}
            >
              {children}
            </div>
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
