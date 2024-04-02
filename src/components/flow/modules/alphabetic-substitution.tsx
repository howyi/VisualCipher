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
import { SelectProperty } from '@/components/flow/components/properties/select-property'
import { Resizer } from '@/components/flow/components/resizer'
import { NumberProperty } from '@/components/flow/components/properties/number-property'
import { nanoid } from 'nanoid'

type Data = {
  splitType: 'character' | 'space'
  period?: number
  map: {
    [periodKey in string]: {
      [ct in string]: string
    }
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

type Line = {
  ct: string
  pt: string
  periodKey?: string
}[]
type Result = { encrypted: string; lines: Line[] }

export const AlphabeticSubstitutionModule: Module<Data, typeof ports, Result> =
  {
    type: 'alphabetic_substitution_decipher',
    node,
    calculate,
    defaultData: {
      splitType: 'space',
      period: 1,
      map: {
        '1': { A: 'B' },
      },
    },
    name: 'Alphabetic Substitution Decipher',
    description: 'alphabetic string substitution decipher tool',
    ports,
  }

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>) {
  const result = AlphabeticSubstitutionEncrypt(
    inputs?.input ?? '',
    node.data.splitType,
    node.data.map,
    node.data.period
  )
  setResult(result)
  return result.encrypted
}

function AlphabeticSubstitutionEncrypt(
  text: string,
  splitType: Data['splitType'],
  map: Data['map'],
  period: Data['period'] = 1
): Result {
  let rawLines = text
    .split('\n')
    .map((t) => t.split(splitType === 'character' ? '' : ' '))

  const lines: Result['lines'] = []
  let wordCount = 0
  for (let rawLine of rawLines) {
    const line: Line = []
    for (let ct of rawLine) {
      if (ct === ' ') {
        line.push({
          ct,
          pt: ct,
        })
        continue
      }
      const periodKey = `${(wordCount % period) + 1}`
      wordCount++
      const pt = map[periodKey]?.[ct]
      if (!pt) {
        line.push({
          ct,
          pt: UNKNOWN_CHARACTER,
          periodKey,
        })
        continue
      }
      line.push({
        ct,
        pt,
        periodKey,
      })
    }
    lines.push(line)
  }

  let encrypted = ''
  for (let line of lines) {
    for (let word of line) {
      encrypted += word.pt
    }
    encrypted += '\n'
  }

  return {
    encrypted: encrypted,
    lines,
  }
}

type CharacterStatus = {
  pt?: string
  in_input: boolean
}

type WordMap = {
  [ct in string]: CharacterStatus
}

type PeriodMap = {
  [periodKey in string]: WordMap
}

function node({ id, data: initialData, selected }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()
  const [splitType, setSplitType] = useState(initialData.splitType)
  const [map, setMap] = useState(initialData.map)
  const [highlight, setHighlight] = useState<{ periodKey: string; ct: string }>(
    {
      periodKey: '',
      ct: '',
    }
  )
  const [activeKey, setActiveKey] = useState('')
  const [period, setPeriod] = useState(initialData.period ?? 1)
  const lines = useMemo(() => {
    let lines = inputs?.input
      ?.split('\n')
      .map((t) => t.split(splitType === 'character' ? '' : ' '))
    setActiveKey('')
    if (!lines) return []
    return lines
  }, [inputs, splitType])
  const periodMap = useMemo(() => {
    let newPeriodMap: PeriodMap = {}
    for (const periodKey of Object.keys(map)) {
      for (const ct of Object.keys(map[periodKey])) {
        const word = map[periodKey][ct]
        if (!newPeriodMap[periodKey]) {
          newPeriodMap[periodKey] = {}
        }
        newPeriodMap[periodKey][ct] = {
          pt: word,
          in_input: false,
        }
      }
    }
    let wordCount = 0
    for (const l of lines) {
      for (const w of l) {
        if (w === ' ') continue
        const periodKey = `${(wordCount % period) + 1}`
        wordCount++
        if (!newPeriodMap[periodKey]) {
          newPeriodMap[periodKey] = {}
        }
        newPeriodMap[periodKey][w] = {
          pt: map[periodKey]?.[w] ? map[periodKey][w] : undefined,
          in_input: true,
        }
      }
    }
    return newPeriodMap
  }, [lines, map, period])

  useEffect(() => {
    setData({
      splitType,
      map,
      period,
    })
  }, [splitType, map, period])

  return (
    <ModuleNode module={AlphabeticSubstitutionModule} className={' h-full '}>
      <div className={'flex flex-col gap-4 m-auto whitespace-pre'}>
        <SelectProperty<Data['splitType']>
          label={'splitType'}
          value={splitType}
          setValue={(value) => setSplitType(value)}
          values={['character', 'space']}
        />
        <NumberProperty
          min={1}
          label={'period'}
          value={period}
          setValue={setPeriod}
        />
        <div
          className={
            'flex flex-col m-auto w-full overflow-x-scroll gap-3 font-mono h-full text-wrap whitespace-pre'
          }
        >
          {result?.lines.map((line, lk) => (
            <div className={'flex flex-row  gap-0.5'} key={lk}>
              {line.map((word, tk) => {
                const key = `${lk}${tk}`
                const status = word.periodKey
                  ? periodMap[word.periodKey]?.[word.ct] ?? undefined
                  : undefined
                const inputActive = key === activeKey
                const isHighlighted =
                  highlight.ct === word.ct &&
                  !!word.periodKey &&
                  highlight.periodKey == word.periodKey
                return (
                  <div
                    key={key}
                    className={
                      'flex flex-col text-center hover:cursor-text ' +
                      (isHighlighted ? ' text-module-hint' : '') +
                      (isHighlighted || status?.in_input
                        ? ''
                        : ' text-destructive') +
                      (isHighlighted || status?.pt
                        ? ''
                        : ' text-muted-foreground')
                    }
                    onMouseEnter={() => {
                      if (!word.periodKey) return
                      setHighlight({ ct: word.ct, periodKey: word.periodKey })
                    }}
                    onMouseLeave={() => {
                      if (word.periodKey && isHighlighted)
                        setHighlight({
                          ct: word.ct,
                          periodKey: word.periodKey,
                        })
                    }}
                    onClick={() => setActiveKey(key)}
                  >
                    {period != 1 && (
                      <span className={'text-muted-foreground text-xs'}>
                        {word.periodKey ?? ''}
                      </span>
                    )}
                    <span>{word.ct}</span>
                    {inputActive && word.periodKey ? (
                      <Input
                        autoFocus={true}
                        className={
                          'w-2 mx-auto p-0 border-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0'
                        }
                        placeholder={map[word.periodKey]?.[word.ct]}
                        defaultValue={''}
                        onChange={(e) => {
                          if (!word.periodKey) return
                          const newMap = { ...map }
                          if (!newMap[word.periodKey]) {
                            newMap[word.periodKey] = {}
                          }
                          newMap[word.periodKey][word.ct] = e.target.value
                          setMap(newMap)
                          setActiveKey('')
                        }}
                        onBlur={() => setActiveKey('')}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setActiveKey('')
                          }
                          if (e.key === 'Delete' || e.key === 'Backspace') {
                            const newMap = map
                            delete newMap[word.periodKey!][word.ct]
                            setMap({ ...newMap })
                            setActiveKey('')
                          }
                        }}
                      ></Input>
                    ) : (
                      <span>
                        {word.periodKey
                          ? map[word.periodKey]?.[word.ct] ?? '-'
                          : word.ct}
                      </span>
                    )}
                  </div>
                )
              })}
              {'  '}
            </div>
          ))}
        </div>
        <Separator />
        <span className={'text-muted-foreground text-center'}>map</span>
        <div className={'flex flex-col m-auto  flex-wrap gap-2'}>
          {Object.keys(periodMap)
            .sort()
            .map((periodKey, tk) => {
              const wordMap = periodMap[periodKey]

              return (
                <div className={'flex flex-row'} key={periodKey}>
                  <div className={'my-auto px-3 font-bold'}>{periodKey}</div>
                  {Object.keys(wordMap)
                    .sort()
                    .map((ct) => {
                      const word = {
                        ct: ct,
                        periodKey: periodKey,
                      }
                      const key = `map_${periodKey}__${ct}`
                      const status = word.periodKey
                        ? periodMap[word.periodKey][word.ct]
                        : undefined
                      const inputActive = key === activeKey
                      const isHighlighted =
                        highlight.ct === word.ct &&
                        !!word.periodKey &&
                        highlight.periodKey == word.periodKey
                      return (
                        <div
                          key={key}
                          className={
                            'flex flex-col text-center hover:cursor-text ' +
                            (isHighlighted ? ' text-module-hint' : '') +
                            (isHighlighted || status?.in_input
                              ? ''
                              : ' text-destructive') +
                            (isHighlighted || status?.pt
                              ? ''
                              : ' text-muted-foreground')
                          }
                          onMouseEnter={() => {
                            if (!word.periodKey) return
                            setHighlight({
                              ct: word.ct,
                              periodKey: word.periodKey,
                            })
                          }}
                          onMouseLeave={() => {
                            if (word.periodKey && isHighlighted)
                              setHighlight({
                                ct: word.ct,
                                periodKey: word.periodKey,
                              })
                          }}
                          onClick={() => setActiveKey(key)}
                        >
                          <span>{word.ct}</span>
                          {inputActive && word.periodKey ? (
                            <Input
                              autoFocus={true}
                              className={
                                'w-2 mx-auto p-0 border-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0'
                              }
                              placeholder={map[word.periodKey]?.[word.ct]}
                              defaultValue={''}
                              onChange={(e) => {
                                if (!word.periodKey) return
                                const newMap = { ...map }
                                if (!newMap[word.periodKey]) {
                                  newMap[word.periodKey] = {}
                                }
                                newMap[word.periodKey][word.ct] = e.target.value
                                setMap(newMap)
                                setActiveKey('')
                              }}
                              onBlur={() => setActiveKey('')}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setActiveKey('')
                                }
                                if (
                                  e.key === 'Delete' ||
                                  e.key === 'Backspace'
                                ) {
                                  const newMap = map
                                  delete newMap[word.periodKey][word.ct]
                                  setMap({ ...newMap })
                                  setActiveKey('')
                                }
                              }}
                            ></Input>
                          ) : (
                            <span>
                              {word.periodKey
                                ? map[word.periodKey]?.[word.ct] ?? '-'
                                : word.ct}
                            </span>
                          )}
                        </div>
                      )
                    })}
                </div>
              )
            })}
        </div>
      </div>
      <Resizer id={id} selected={selected} />
    </ModuleNode>
  )
}
