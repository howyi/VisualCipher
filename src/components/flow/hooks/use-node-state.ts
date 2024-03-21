import { Inputs, Ports } from '@/components/flow/modules/types'
import { createWithEqualityFn } from 'zustand/traditional'
import { useNodeId } from 'reactflow'

type NodeState<T extends Ports> = {
  inputs?: Inputs<keyof T['in']>
  error?: string
}

export type NodeStates = {
  [nodeId in string]: NodeState<any>
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

export function useNodeState<T extends Ports>() {
  const nodeId = useNodeId()
  return useNodeStateStore(
    (state) => state.states[nodeId ?? ''] as NodeState<T>,
    (oldState, newState) =>
      JSON.stringify(oldState) === JSON.stringify(newState)
  )
}
