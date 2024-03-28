import { Inputs, Ports, Result } from '@/components/flow/modules/types'
import { createWithEqualityFn } from 'zustand/traditional'
import { useNodeId, useUpdateNodeInternals } from 'reactflow'
import { useEffect } from 'react'

type NodeState<T extends Ports<any>, R extends Result> = {
  inputs?: Inputs<keyof T['in']>
  error?: string
  result?: R
}

export type NodeStates = {
  [nodeId in string]: NodeState<any, any>
}

interface NodeStoreState {
  states: NodeStates
  set: (by: NodeStates) => void
}

export const useNodeStateStore = createWithEqualityFn<NodeStoreState>()(
  (set) => ({
    states: {},
    set: (by: NodeStates) => set({ states: by }),
  })
)

export function useNodeState<
  T extends Ports<any>,
  R extends Result = undefined,
>() {
  const nodeId = useNodeId()
  const updateNodeInternals = useUpdateNodeInternals()
  const store = useNodeStateStore(
    (state) => state.states[nodeId ?? ''] as NodeState<T, R>,
    (oldState, newState) =>
      JSON.stringify(oldState) === JSON.stringify(newState)
  )

  useEffect(() => {
    if (nodeId) {
      updateNodeInternals(nodeId)
    }
  }, [store.inputs])

  return store
}
