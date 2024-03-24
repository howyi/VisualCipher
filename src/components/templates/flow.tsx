import * as React from 'react'
import { useEffect, useState } from 'react'
import { Flow } from '@/components/organisms/flow'
import { Edge, Node, ReactFlowProvider } from 'reactflow'
import { Toaster } from '@/components/ui/sonner'
import { Document } from '@/components/organisms/document'
import { useDocumentPathStore } from '@/docs/use-document-path'
import { useLocalStorage } from 'usehooks-ts'

type Props = {
  title: string
  nodes: Node<any>[]
  edges: Edge<any>[]
  storageKey?: string // undefined = can't save
  documentOpen?: boolean
  documentPath: string
}

export function FlowTemplate({
  title,
  nodes,
  edges,
  storageKey,
  documentOpen,
  documentPath,
}: Props) {
  const [infoOpen, setInfoOpen] =
    documentOpen === undefined
      ? useLocalStorage('open', true)
      : useState(documentOpen)
  const move = useDocumentPathStore((state) => state.set)
  useEffect(() => {
    move(documentPath)
  }, [documentPath])
  return (
    <main className={'flex flex-row'}>
      <Toaster position={'bottom-left'} />
      <div
        style={{
          width: infoOpen ? 'calc(100vw - 500px)' : '100vw',
          height: '100vh',
        }}
      >
        <ReactFlowProvider>
          <Flow
            infoOpen={infoOpen}
            onClickInfo={() => setInfoOpen(!infoOpen)}
            title={title}
            nodes={nodes}
            edges={edges}
            storageKey={storageKey}
          />
        </ReactFlowProvider>
      </div>
      {infoOpen && <Document onClose={() => setInfoOpen(false)} />}
    </main>
  )
}
