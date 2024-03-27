import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  getOutgoers,
  Node,
  NodeChange,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowJsonObject,
} from 'reactflow'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import 'reactflow/dist/base.css'
import { nanoid } from 'nanoid'
import { useBoolean, useDebounceCallback, useLocalStorage } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import {
  GitHubLogoIcon,
  InfoCircledIcon,
  MinusIcon,
  PinRightIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Module, ModuleNode } from '@/components/flow/modules/types'
import { calculate } from '@/components/flow/resolvers/calculate'
import { RegisteredModules } from '@/components/flow/modules'
import {
  NodeStates,
  useNodeStateStore,
} from '@/components/flow/hooks/use-node-state'
import { Input } from '@/components/ui/input'
import { SettingButton } from '@/components/organisms/setting-button'

type Props = {
  title: string
  nodes: Node<any>[]
  edges: Edge<any>[]
  storageKey?: string // undefined = can't save
  onClickInfo: () => void
  infoOpen: boolean
}

export function Flow({
  title,
  nodes: initialNodes,
  edges: initialEdges,
  storageKey,
  onClickInfo,
  infoOpen,
}: Props) {
  const [nodes, setNodes] = React.useState<Node<any>[]>([])
  const [edges, setEdges] = React.useState<Edge<any>[]>([])
  const [saved, setSaved] = useLocalStorage(storageKey ?? '', '')
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance>()
  const setNodeStates = useNodeStateStore((state) => state.set)

  const debouncedSave = useDebounceCallback((instance: ReactFlowInstance) => {
    if (instance.getNodes().length == 0) {
      return
    }
    setSaved(JSON.stringify(instance.toObject()))
  }, 1000)

  const nodeTypes = React.useMemo(() => {
    const results: { [key in string]: ModuleNode } = {}
    for (let type in RegisteredModules) {
      results[type] = RegisteredModules[type].node
    }
    return results
  }, [])

  React.useEffect(() => {
    if (storageKey && saved) {
      const i = JSON.parse(saved) as ReactFlowJsonObject
      setNodes(i.nodes)
      setEdges(i.edges)
    } else {
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [])

  React.useEffect(() => {
    const newNodeStates: NodeStates = {}
    console.debug('calculate', nanoid())

    const nodeOutputCache: {
      [nodeId in string]: { [portId in string]: string }
    } = {}
    calculate({
      nodes,
      edges,
      updateNodeData: (nd, newData) => {
        for (let key of Object.keys(newData)) {
          if (JSON.stringify(nd.data?.[key]) != JSON.stringify(newData[key])) {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === nd.id
                  ? { ...node, data: { ...node.data, ...newData } }
                  : node
              )
            )
            return
          }
        }
      },
      updateNodeResult: (nd, newResult) => {
        if (!newNodeStates[nd.id]) {
          newNodeStates[nd.id] = {}
        }
        newNodeStates[nd.id].result = newResult
      },
      updateNodeInputs: (nd, newInputs) => {
        if (!newNodeStates[nd.id]) {
          newNodeStates[nd.id] = {}
        }
        newNodeStates[nd.id].inputs = newInputs
      },
      updateNodeError: (nd, newError) => {
        if (!newNodeStates[nd.id]) {
          newNodeStates[nd.id] = {}
        }
        newNodeStates[nd.id].error = newError
      },
      getNodeOutputCache: (nodeId, portId) => {
        return nodeOutputCache?.[nodeId]?.[portId]
      },
      setNodeOutputCache: (nodeId, portId, value) => {
        if (!nodeOutputCache?.[nodeId]) {
          nodeOutputCache[nodeId] = {}
        }
        nodeOutputCache[nodeId][portId] = value
      },
    })
    setNodeStates(newNodeStates)
    if (storageKey && reactFlowInstance) {
      debouncedSave(reactFlowInstance)
    }
  }, [nodes, edges])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  // cycle validation
  const isValidConnection = useCallback(
    (connection: { target: any; source: any }) => {
      const target = nodes.find(
        (node: { id: any }) => node.id === connection.target
      )
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false

        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }

      if (target) {
        if (target.id === connection.source) return false
        return !hasCycle(target)
      }
      return false
    },
    [nodes, edges]
  )

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/visualcipher')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      // @ts-ignore
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const newNode = {
        id: nanoid(),
        type,
        position,
        data: RegisteredModules[type].defaultData ?? {},
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      isValidConnection={isValidConnection}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      snapToGrid={true}
      onlyRenderVisibleElements={true}
      defaultEdgeOptions={{
        type: 'step',
      }}
      fitView
    >
      <Background className="bg-background" variant={BackgroundVariant.Dots} />
      <Controls />
      <Panel position="bottom-right">
        <Palette />
      </Panel>
      <Panel
        position="top-right"
        className={'flex flex-row gap-2 font-mono text-muted-foreground'}
      >
        <SettingButton
          storageKey={storageKey}
          onUpload={(file) => {
            setNodes(file.nodes)
            setEdges(file.edges)
            toast('Import succeeded!🎉')
          }}
          onDownload={() => {
            if (!reactFlowInstance) {
              return
            }
            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
              JSON.stringify(reactFlowInstance.toObject())
            )}`
            const link = document.createElement('a')
            link.href = jsonString
            link.download = 'visualcipher.json'

            link.click()
          }}
          onReset={() => {
            setSaved('')
            window.location.reload()
          }}
        />
        <Button className={'md:block hidden'} size={'sm'} onClick={onClickInfo}>
          {infoOpen ? <PinRightIcon /> : <InfoCircledIcon />}
        </Button>
      </Panel>
    </ReactFlow>
  )
}

function Palette() {
  const open = useBoolean(false)
  const [search, setSearch] = useState('')
  const filteredModules = useMemo(() => {
    return Object.keys(RegisteredModules)
      .filter((type) => {
        const module = RegisteredModules[type]
        const searchString = (type + module.name).toLowerCase()
        return searchString.includes(search.toLowerCase())
      })
      .map((k) => RegisteredModules[k])
  }, [search])

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/visualcipher', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className={'flex flex-col gap-2 pb-2 w-72 max-h-screen'}>
      {open.value && (
        <>
          {filteredModules.length > 0 ? (
            <>
              <div className="mt-24">Drag and place the module</div>
              <div className={'h-full overflow-y-scroll flex flex-col gap-2'}>
                {filteredModules.map((module) => {
                  return (
                    <ModuleSelector
                      key={module.type}
                      module={module}
                      onDragStart={onDragStart}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <>Module not found</>
          )}
        </>
      )}
      <div className={'text-right'}>
        {open.value ? (
          <div className={'flex flex-row gap-4'}>
            <Button onClick={open.toggle}>
              <MinusIcon />
            </Button>
            <Input
              placeholder={'filter'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus={true}
            />
          </div>
        ) : (
          <Button onClick={open.toggle}>
            <PlusIcon /> Add modules
          </Button>
        )}
      </div>
    </div>
  )
}

function ModuleSelector({
  module,
  onDragStart,
}: {
  module: Module<any, any>
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}) {
  const expand = useBoolean(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={expand.toggle}
            key={module.type}
            className="cursor-grab break-all flex flex-col gap-2 w-full border-2 rounded-md p-2 bg-background"
            onDragStart={(event) => onDragStart(event, module.type)}
            draggable
          >
            <div>{module.name}</div>
            {module.description && (
              <pre
                className={
                  'text-wrap text-muted-foreground text-xs' +
                  (expand.value ? '' : ' line-clamp-3')
                }
              >
                {module.description}
              </pre>
            )}
            {expand.value && (
              <div className={'text-xs'}>
                <Table>
                  <TableCaption>Interface</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Id</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(module.ports.in).map((id) => (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell className={'text-module-input'}>
                          in
                        </TableCell>
                        <TableCell>{module.ports.in[id].description}</TableCell>
                      </TableRow>
                    ))}
                    {Object.keys(module.ports.out).map((id) => (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell className={'text-module-output'}>
                          out
                        </TableCell>
                        <TableCell>
                          {module.ports.out[id].description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side={'left'}>
          <p>Click to expand</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
