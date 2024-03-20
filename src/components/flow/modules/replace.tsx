import React, { useEffect, useMemo, useState } from 'react'
import { NodeProps } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Module, ModuleProcess } from '@/components/flow/modules/types'
import { ModuleNode } from '@/components/flow/components/module-node'
import { useNodeDataState } from '@/components/flow/hooks/use-node-data-state'
import { Button } from '@/components/ui/button'

export type ReplaceData = {
  search?: string
  replace?: string
}

export const ReplaceProcess: ModuleProcess<ReplaceData> = (
  node,
  params,
  inputs
) => {
  return (
    inputs.input?.replaceAll(node.data.search ?? '', node.data.replace ?? '') ??
    ''
  )
}

export const ReplaceModule: Module<ReplaceData> = {
  type: 'replace',
  node: Replace,
  process: ReplaceProcess,
  defaultData: {},
  name: 'Replace',
  description: `Replace specific string with specific string
add a new line code at the end by pressing the [\\n] button`,
  ports: {
    in: {
      input: {},
    },
    out: {
      output: {},
    },
  },
}

export function Replace({ id, data: initialData }: NodeProps<ReplaceData>) {
  const [data, setData] = useNodeDataState<ReplaceData>(id, initialData)
  const [search, setSearch] = useState(initialData.search)
  const searchLineBreak = useMemo(() => {
    return search?.slice(search?.length - 1, search?.length) === '\n'
  }, [search])
  const [replace, setReplace] = useState(initialData.replace)
  const replaceLineBreak = useMemo(() => {
    return replace?.slice(replace?.length - 1, replace?.length) === '\n'
  }, [replace])

  useEffect(() => {
    setData({ search, replace })
  }, [search, replace])

  return (
    <ModuleNode module={ReplaceModule}>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex flex-row gap-2'}>
          <Label htmlFor="text" className={'flex-0 my-auto'}>
            search:
          </Label>
          <Input
            className={'flex-1 underline'}
            id="text"
            name="text"
            value={data.search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className={'flex-0'}
            variant={searchLineBreak ? 'default' : 'outline'}
            onClick={() =>
              searchLineBreak
                ? setSearch(search?.slice(0, search?.length - 1))
                : setSearch(search + '\n')
            }
          >
            \n
          </Button>
        </div>
        <div className={'flex flex-row gap-2'}>
          <Label htmlFor="text" className={'flex-0 my-auto'}>
            replace:
          </Label>
          <Input
            className={'flex-1 underline'}
            id="text"
            name="text"
            value={data.replace}
            onChange={(e) => setReplace(e.target.value)}
          />
          <Button
            className={'flex-0'}
            variant={replaceLineBreak ? 'default' : 'outline'}
            onClick={() =>
              replaceLineBreak
                ? setReplace(replace?.slice(0, replace?.length - 1))
                : setReplace(replace + '\n')
            }
          >
            \n
          </Button>
        </div>
      </div>
    </ModuleNode>
  )
}
