import * as React from 'react'
import { useState } from 'react'
import { Flow } from '@/components/flow'
import { Edge, Node, ReactFlowProvider } from 'reactflow'
import { Button } from '@/components/ui/button'
import {
  DoubleArrowRightIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { Toaster } from '@/components/ui/sonner'
import { RichTextEditor } from '@/components/organisms/rich-text-editor'

type Props = {
  title: string
  nodes: Node<any>[]
  edges: Edge<any>[]
  storageKey?: string // undefined = can't save
  information?: string
}

export function FlowTemplate({
  title,
  nodes,
  edges,
  storageKey,
  information,
}: Props) {
  const [infoOpen, setInfoOpen] = useState(true)
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
            onClickInfo={() => setInfoOpen(!infoOpen)}
            title={title}
            nodes={nodes}
            edges={edges}
            storageKey={storageKey}
          />
        </ReactFlowProvider>
      </div>
      {infoOpen && (
        <div
          className={
            'border-l-2 p-4 flex flex-col gap-2 w-[500px] prose-sm prose dark:prose-invert h-screen overflow-y-scroll'
          }
        >
          <Button
            className={'flex flex-row gap-2'}
            variant={'ghost'}
            size={'sm'}
            onClick={() => setInfoOpen(false)}
          >
            <DoubleArrowRightIcon />
            close
          </Button>
          <div className={'flex flex-row gap-2 pb-2'}>
            <Button
              size={'sm'}
              className={'w-full flex flex-row gap-2'}
              asChild
            >
              <a
                className={'flex-1 no-underline'}
                href={'https://github.com/howyi/visual-cipher'}
                target={'_blank'}
              >
                <GitHubLogoIcon /> source code
              </a>
            </Button>
            <Button
              size={'sm'}
              className={'w-full flex flex-row gap-2'}
              asChild
            >
              <a
                className={'flex-1 no-underline'}
                href={'https://twitter.com/howyi_lq'}
                target={'_blank'}
              >
                <TwitterLogoIcon /> @howyi_lq
              </a>
            </Button>
          </div>
          <RichTextEditor editable={false} content={information} />
        </div>
      )}
    </main>
  )
}
