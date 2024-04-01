import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Module,
  ModuleProcessProps,
  Ports,
} from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeData } from '@/components/flow/hooks/use-node-data'
import { Button } from '@/components/ui/button'
import {
  EditableTableProperty,
  getEditableTableKey,
  TableData,
  TableValue,
} from '@/components/flow/components/properties/editable-table-property'
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { UNKNOWN_CHARACTER } from '@/components/flow/utils/const'
import { useBoolean } from 'usehooks-ts'
import { CheckProperty } from '@/components/flow/components/properties/check-property'

type Data = {
  table: TableData
  decryptMode: boolean
}

const ports = {
  in: {
    input: {},
  },
  out: {
    output: {},
  },
} as const satisfies Ports<Data>

type Result = { highlight: { row: string; column: string } }

function calculate({
  node,
  inputs,
  setResult,
}: ModuleProcessProps<Data, typeof ports, Result>) {
  if (!inputs.input) {
    return ''
  }
  let encrypted: string[] = []
  let highlightRow = ''
  let highlightCol = ''

  if (node.data.decryptMode) {
    for (let character of inputs.input.replaceAll('\n', ' ').split(' ')) {
      const found = node.data.table.values.find(
        (v) => v.row === character.charAt(1) && v.column === character.charAt(0)
      )
      if (!found) {
        highlightRow = character.charAt(1)
        highlightCol = character.charAt(0)
        encrypted.push(UNKNOWN_CHARACTER)
        continue
      }
      encrypted.push(found.value)
      highlightRow = found.row
      highlightCol = found.column
    }
  } else {
    for (let character of inputs.input.split('')) {
      if (character === '\n') {
        encrypted.push(' ')
        continue
      }
      const found = node.data.table.values.find(
        (v) =>
          v.value === character &&
          node.data.table.rows.includes(v.row) &&
          node.data.table.columns.includes(v.column)
      )
      if (!found) {
        highlightRow = ''
        highlightCol = ''
        encrypted.push(UNKNOWN_CHARACTER + UNKNOWN_CHARACTER)
        continue
      }
      encrypted.push(found.column + found.row)
      highlightRow = found.row
      highlightCol = found.column
    }
  }
  setResult({
    highlight: {
      row: highlightRow,
      column: highlightCol,
    },
  })
  return encrypted.join(node.data.decryptMode ? '' : ' ')
}

export const StraddlingCheckerboardModule: Module<Data, typeof ports, Result> =
  {
    type: 'straddling_checkerboard',
    node,
    calculate,
    defaultData: {
      table: {
        rows: ['1', 'b'],
        columns: ['A', 'D'],
        values: [
          {
            row: '1',
            column: 'D',
            value: 'X',
          },
        ],
      },
      decryptMode: false,
    },
    name: 'Straddling Checkerboard',
    description: ``,
    ports,
  }

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs, result } = useNodeState<typeof ports, Result>()
  const decryptMode = useBoolean(initialData.decryptMode ?? false)
  const [rows, setRows] = useState<string>(initialData.table.rows.join(''))
  const [cols, setCols] = useState<string>(initialData.table.columns.join(''))
  const [values, setValues] = useState<{ [key in string]: TableValue }>(
    initialData.table.values.reduce(
      (acc, m) => {
        const key = getEditableTableKey(m.row, m.column)
        acc[key] = m
        return acc
      },
      {} as { [type in string]: TableValue }
    )
  )

  useEffect(() => {
    setData({
      table: {
        rows: rows.split(''),
        columns: cols.split(''),
        values: Object.values(values),
      },
      decryptMode: decryptMode.value,
    })
  }, [rows, cols, values, decryptMode.value])

  return (
    <ModuleNode module={StraddlingCheckerboardModule}>
      <div className={'flex flex-col gap-2'}>
        <CheckProperty label={'decrypt'} value={decryptMode} />
        <EditableTableProperty
          label={'checkerboard'}
          decryptMode={decryptMode.value}
          highlightRow={result?.highlight.row ?? ''}
          highlightColumn={result?.highlight.column ?? ''}
          rows={rows}
          setRows={setRows}
          columns={cols}
          setColumns={setCols}
          value={values}
          setValue={setValues}
        />
      </div>
    </ModuleNode>
  )
}
