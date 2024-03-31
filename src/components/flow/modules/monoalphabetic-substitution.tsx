import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps, NodeResizer, useUpdateNodeInternals } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { Separator } from '@/components/ui/separator'
import { StringConnector } from '@/components/flow/components/string-connector'
import { ALPHABETS, UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { Highlight } from '@/components/flow/components/highlight'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { Simulate } from 'react-dom/test-utils'
import encrypted = Simulate.encrypted

type Data = {
  splitType: 'char' | 'space'
  map: {
    [ct in string]: string
  }
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>
export const MonoalphabeticSubstitutionModule: Module<Data, typeof ports> = {
  type: 'monoalphabetic_substitution',
  node,
  calculate,
  defaultData: {
    splitType: 'space',
    map: {
      A: 'B',
    },
  },
  name: 'Monoalphabetic Substitution (incomplete)',
  description: 'monoalphabetic string substitution',
  ports,
}

function calculate({ node, inputs }: ModuleProcessProps<Data, typeof ports>) {
  return MonoalphabeticSubstitutionEncrypt(
    inputs?.input ?? '',
    node.data.splitType,
    node.data.map
  ).encrypted
}

function MonoalphabeticSubstitutionEncrypt(
  text: string,
  splitType: Data['splitType'],
  map: Data['map']
): {
  encrypted: string
} {
  let lines = text.split('\n').map((t) => t.split(' '))
  const encrypted = lines
    .map((l) => {
      return l.map((t) => map[t] ?? '-').join('')
    })
    .join('\n')
  return {
    encrypted: encrypted,
  }
}

function node({ id, data: initialData, selected }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs } = useNodeState<typeof ports>()
  const [splitType, setSplitType] = useState(initialData.splitType)
  const [map, setMap] = useState(initialData.map)
  const lines = useMemo(() => {
    let lines = inputs?.input?.split('\n').map((t) => t.split(' '))
    if (!lines) return []
    return lines
  }, [inputs])
  const statusMap = useMemo(() => {
    let newStatusMap: {
      [ct in string]: {
        pt?: string
        in_input: boolean
      }
    } = {}
    for (const k of Object.keys(map)) {
      newStatusMap[k] = {
        pt: map[k],
        in_input: false,
      }
    }
    for (const l of lines) {
      for (const w of l) {
        newStatusMap[w] = {
          pt: map[w] ? map[w] : undefined,
          in_input: true,
        }
      }
    }
    return newStatusMap
  }, [lines, map])
  const [highlight, setHighlight] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const updateNodeInternals = useUpdateNodeInternals()

  useEffect(() => {
    setData({
      splitType,
      map,
    })
  }, [splitType, map])

  return (
    <ModuleNode
      module={MonoalphabeticSubstitutionModule}
      className={' h-full '}
    >
      <div className={'flex flex-col gap-4 m-auto whitespace-pre'}>
        <div
          className={
            'flex flex-row flex-wrap m-auto gap-3 font-mono h-full text-wrap whitespace-pre'
          }
        >
          {lines.map((l, lk) => (
            <div className={'flex flex-row  gap-0.5'} key={lk}>
              {l.map((t, tk) => {
                const key = `${lk}${tk}`
                const status = statusMap[t]
                const inputActive = key === activeKey
                return (
                  <div
                    key={key}
                    className={
                      'flex flex-col text-center ' +
                      (highlight === t ? ' text-module-hint' : '') +
                      (highlight === t || status?.in_input
                        ? ''
                        : ' text-destructive') +
                      (highlight === t || status?.pt
                        ? ''
                        : ' text-muted-foreground')
                    }
                    onMouseEnter={() => setHighlight(t)}
                    onMouseLeave={() => {
                      if (highlight === t) setHighlight('')
                    }}
                    onClick={() => setActiveKey(key)}
                  >
                    <span>{t}</span>
                    {inputActive ? (
                      <Input
                        autoFocus={true}
                        className={'w-4 p-0 border-0 h-full'}
                        defaultValue={''}
                        onChange={(e) => {
                          setMap({ ...map, [t]: e.target.value })
                          setActiveKey('')
                        }}
                        onBlur={() => setActiveKey('')}
                        onKeyDown={(e) => {
                          if (e.key === 'Delete' || e.key === 'Backspace') {
                            const newMap = map
                            delete newMap[t]
                            setMap({ ...newMap })
                            setActiveKey('')
                          }
                        }}
                      ></Input>
                    ) : (
                      <span>{map[t] ?? '-'}</span>
                    )}
                  </div>
                )
              })}
              {'  '}
            </div>
          ))}
        </div>
        <Separator />
        <span className={'text-muted-foreground'}>map</span>
        <div className={'flex flex-row flex-wrap gap-2'}>
          {Object.keys(statusMap)
            .sort()
            .map((t, tk) => {
              const status = statusMap[t]
              const key = `unuse_${tk}`
              const inputActive = key === activeKey
              return (
                <div
                  key={key}
                  className={
                    'flex flex-col text-center ' +
                    (highlight === t ? ' text-module-hint' : '') +
                    (status?.in_input ? '' : ' text-destructive') +
                    (status?.pt ? '' : ' text-muted-foreground')
                  }
                  onMouseEnter={() => setHighlight(t)}
                  onMouseLeave={() => {
                    if (highlight === t) setHighlight('')
                  }}
                  onClick={() => setActiveKey(key)}
                >
                  <span>{t}</span>
                  {inputActive ? (
                    <Input
                      autoFocus={true}
                      className={'w-2 p-0 border-0 h-full focus-visible:ring-0'}
                      defaultValue={''}
                      onChange={(e) => {
                        setMap({ ...map, [t]: e.target.value })
                        setActiveKey('')
                      }}
                      onBlur={() => setActiveKey('')}
                      onKeyDown={(e) => {
                        if (e.key === 'Delete' || e.key === 'Backspace') {
                          const newMap = map
                          delete newMap[t]
                          setMap({ ...newMap })
                          setActiveKey('')
                        }
                      }}
                    ></Input>
                  ) : (
                    <span>{map[t] ?? '-'}</span>
                  )}
                </div>
              )
            })}
        </div>
      </div>
      <NodeResizer
        color="#555555"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
        onResizeEnd={() => {
          updateNodeInternals(id)
        }}
      />
    </ModuleNode>
  )
}
