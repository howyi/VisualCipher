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
    <main className={'flex md:flex-row flex-col'}>
      <Toaster position={'bottom-left'} />
      <div
        className={
          (infoOpen ? 'md:w-[calc(100vw - 500px)] sm:w-screen' : 'w-screen') +
          ' md:h-screen h-[80vh]'
        }
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
