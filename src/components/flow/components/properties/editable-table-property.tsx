import React, { useState } from 'react'
import { StringProperty } from '@/components/flow/components/properties/string-property'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { onlyUnique } from '@/lib/only-unique'
import { ModuleItemContainer } from '@/components/flow/components/module-item-container'

export type TableValue = {
  row: string
  column: string
  value: string
}

export type TableData = {
  rows: string[]
  columns: string[]
  values: TableValue[]
}

type Props = {
  label: string
  decryptMode: boolean
  highlightRow: string
  highlightColumn: string
  rows: string
  setRows: (value: string) => void
  columns: string
  setColumns: (value: string) => void
  value: { [key in string]: TableValue }
  setValue: (value: { [key in string]: TableValue }) => void
}

export function getEditableTableKey(row: string, column: string) {
  return `${column}____${row}`
}
export function EditableTableProperty({
  label,
  decryptMode,
  highlightRow,
  highlightColumn,
  value,
  setValue,
  rows,
  setRows,
  columns,
  setColumns,
}: Props) {
  const [activeKey, setActiveKey] = useState('')
  return (
    <ModuleItemContainer className={'flex flex-col gap-2'}>
      <StringProperty label={'rows'} value={rows} setValue={setRows} />
      <StringProperty label={'columns'} value={columns} setValue={setColumns} />
      <Table>
        <TableCaption>Checkerboard</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {rows
              .split('')
              .filter(onlyUnique)
              .map((v) => (
                <TableHead
                  key={v}
                  className={
                    highlightRow === v
                      ? decryptMode
                        ? 'text-module-input'
                        : 'text-module-output'
                      : ''
                  }
                >
                  {v}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {columns
            .split('')
            .filter(onlyUnique)
            .map((c) => (
              <TableRow key={c}>
                <TableCell
                  className={
                    highlightColumn === c
                      ? decryptMode
                        ? 'text-module-input'
                        : 'text-module-output'
                      : ''
                  }
                >
                  {c}
                </TableCell>
                {rows
                  .split('')
                  .filter(onlyUnique)
                  .map((r) => {
                    const key = getEditableTableKey(r, c)
                    const inputActive = key === activeKey
                    const highlight =
                      highlightColumn === c && highlightRow === r
                    return (
                      <TableCell
                        className={
                          highlight
                            ? decryptMode
                              ? 'text-module-output'
                              : 'text-module-input'
                            : ''
                        }
                        key={key}
                        onClick={() => setActiveKey(key)}
                      >
                        {inputActive ? (
                          <Input
                            autoFocus={true}
                            className={
                              'w-4 p-0 rounded-none border-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0'
                            }
                            defaultValue={''}
                            onChange={(e) => {
                              setValue({
                                ...value,
                                [key]: {
                                  row: r,
                                  column: c,
                                  value: e.target.value,
                                },
                              })
                              setActiveKey('')
                            }}
                            onBlur={() => {
                              setActiveKey('')
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setActiveKey('')
                              }
                              if (e.key === 'Delete' || e.key === 'Backspace') {
                                const newMap = value
                                delete newMap[key]
                                setValue(newMap)
                                setActiveKey('')
                              }
                            }}
                          />
                        ) : (
                          <span>{value?.[key]?.value ?? '-'}</span>
                        )}
                      </TableCell>
                    )
                  })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ModuleItemContainer>
  )
}
