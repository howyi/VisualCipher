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

export function ModuleItemContainer({
  className,
  children,
}: {
  className?: ClassValue
} & PropsWithChildren) {
  return <div className={cn('px-2', className)}>{children}</div>
}
