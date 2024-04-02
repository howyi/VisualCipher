import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NodeProps, ReactFlowInstance, useUpdateNodeInternals } from 'reactflow'
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
import { useNodeState } from '@/components/flow/hooks/use-node-state'
import { useBoolean, useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { onlyUnique } from '@/lib/only-unique'

type Data = {}

const ports = {
  in: {
    input: {},
  },
  out: {},
} as const satisfies Ports<Data>

export const WordFinderModule: Module<Data, typeof ports> = {
  type: 'word_finder',
  node,
  calculate: () => '',
  defaultData: {},
  name: 'Word Finder',
  description: `Word finder (input: regex)`,
  ports,
}

function node({ id, data: initialData }: NodeProps<Data>) {
  const [data, setData] = useNodeData<Data>(id, initialData)
  const { inputs } = useNodeState<typeof ports>()
  const isLoading = useBoolean(false)
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const getWords = useCallback(async () => {
    // let words: string[] = []
    // const englishWordsText = await (
    //   await fetch(window.location.origin + '/dict/english.txt')
    // ).text()
    // words = [...words, ...englishWordsText.split('\r\n')].filter(onlyUnique)
    const twl06WordsText = await (
      await fetch(window.location.origin + '/dict/twl06.txt')
    ).text()
    // words = [...words, ...twl06WordsText.split('\r\n')].filter(onlyUnique)
    return twl06WordsText.split('\r\n')
  }, [])
  const updateNodeInternals = useUpdateNodeInternals()

  const debouncedFind = useDebounceCallback(
    async (search: string) => {
      try {
        isLoading.setTrue()
        if (!search) {
          setFoundWords([])
          return
        }
        const words = await getWords()
        const regExp = new RegExp('^' + search + '$', 'gi')
        const foundWords = words
          .filter((word) => regExp.test(word))
          .slice(0, 999)
        setFoundWords(foundWords)
      } catch (e: any) {
        toast(e.message)
      } finally {
        isLoading.setFalse()
        updateNodeInternals(id)
      }
    },
    1000,
    { leading: true }
  )

  useEffect(() => {
    isLoading.setTrue()
    debouncedFind(inputs?.input ?? '')
  }, [inputs?.input])

  return (
    <ModuleNode module={WordFinderModule} className={'w-[440px]'}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-row text-muted-foreground">
          <div className={'flex-1'}>found: {foundWords.length}</div>
          <CollapsibleTrigger asChild>
            <Button className={'flex-0'} variant="ghost" size="xs">
              Search hint
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className={'bg-muted-foreground rounded-md text-wrap p-2 mb-4'}>
            Flexible search using{' '}
            <a
              className={'underline'}
              href={'https://en.wikipedia.org/wiki/Regular_expression#Examples'}
              target={'_blank'}
            >
              regular expression notation
            </a>
            <br /> <br />
            Commonly used wildcard: <br />
            . Any single character <br />
            .* Any characters zero or more times. <br />
            <br />
            Example: <br />
            Start with T <br /> → t.* <br />
            Start with T, end With D, 4 Letters
            <br /> → C..D
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div
        className={
          'nodrag select-text cursor-text nowheel flex flex-row flex-wrap gap-2 max-h-[500px] overflow-y-scroll'
        }
      >
        {isLoading.value && (
          <span className={'m-auto text-muted-foreground'}>loading</span>
        )}
        {!isLoading.value && (
          <>
            {foundWords.map((word) => (
              <div key={word}>{word}</div>
            ))}
          </>
        )}
      </div>
    </ModuleNode>
  )
}
