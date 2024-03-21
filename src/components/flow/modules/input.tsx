import React, { useEffect, useState } from 'react'
import { NodeProps, NodeResizer } from 'reactflow'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { Textarea } from '@/components/ui/textarea'
import { PauseIcon, PlayIcon, TrackPreviousIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useBoolean, useInterval } from 'usehooks-ts'

type Data = {
  value?: string
  currentValue?: string
  isPlaying?: boolean
}

const ports = {
  in: {},
  out: {
    output: {},
  },
} as const satisfies Ports

export const InputModule: Module<Data, typeof ports> = {
  type: 'input',
  node,
  process,
  defaultData: {
    value: '',
    currentValue: '',
    isPlaying: false,
  },
  name: 'Input',
  description: `Basic input field.
Pressing the playback button will enter a mode that loops the process of processing one character at a time`,
  ports,
}

function process({ node }: ModuleProcessProps<Data, typeof ports>) {
  if (node.data.isPlaying) {
    return node.data.currentValue ?? ''
  }
  return node.data.value ?? ''
}

function node({ id, data: initialData, selected }: NodeProps<Data>) {
  const [nodeData, setNodeData] = useNodeDataState<Data, typeof ports>(
    id,
    initialData
  )
  const [text, setText] = useState(initialData.value ?? '')
  const isPlaying = useBoolean(!!initialData.isPlaying)
  const [playCurrentPosition, setPlayCurrentPosition] = useState(0)

  useInterval(
    () => {
      let newPos = playCurrentPosition + 1
      const onEnd = playCurrentPosition == text.length
      if (onEnd) {
        newPos = 1
      }
      setPlayCurrentPosition(newPos)
      setNodeData({
        currentValue: text.slice(0, newPos),
      })
    },
    isPlaying.value ? 500 : null
  )

  useEffect(() => {
    setNodeData({
      value: text,
      isPlaying: isPlaying.value,
    })
  }, [text, isPlaying.value])

  return (
    <ModuleNode
      module={InputModule}
      label={
        <>
          <div className={'flex flex-row gap-2'}>
            <div className={'flex-1'}>Input</div>
            {isPlaying.value && (
              <div className={'flex-0'}>
                {playCurrentPosition}/{text.length}
              </div>
            )}
            <Button
              variant={'outline'}
              size={'xs'}
              onClick={() => setPlayCurrentPosition(0)}
            >
              <TrackPreviousIcon className="h-4 w-4 my-auto" />
            </Button>
            <Button
              className={'w-6'}
              variant={isPlaying.value ? 'default' : 'outline'}
              size={'xs'}
              onClick={isPlaying.toggle}
            >
              {isPlaying.value ? (
                <PauseIcon className="h-4 w-4 my-auto" />
              ) : (
                <PlayIcon className="h-4 w-4 my-auto" />
              )}
            </Button>
          </div>
        </>
      }
      className={'h-full border-module-input pb-14'}
    >
      <NodeResizer
        color="#555555"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
      />
      <Textarea
        onFocus={isPlaying.setFalse}
        id="text"
        name="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={'nodrag' + (isPlaying.value ? ' text-muted-foreground' : '')}
      />
    </ModuleNode>
  )
}
