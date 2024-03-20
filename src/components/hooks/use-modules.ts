import React from 'react'
import { Module, ModuleNode } from '@/components/flow/modules/types'
import { RegisteredModules } from '@/components/flow/modules'

export function useModules(): [
  { [key in string]: Module },
  { [key in string]: ModuleNode },
] {
  const nodeTypes = React.useMemo(() => {
    const results: { [key in string]: ModuleNode } = {}
    for (let type in RegisteredModules) {
      results[type] = RegisteredModules[type].node
    }
    return results
  }, [])
  return [RegisteredModules, nodeTypes]
}
