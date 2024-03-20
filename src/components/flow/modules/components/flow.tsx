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
import { useCallback, useState } from 'react'
import { Link } from 'gatsby'

import 'reactflow/dist/base.css'
import {
  useModules,
} from '@/components/hooks/use-modules'
import { nanoid } from 'nanoid'
import { useBoolean, useDebounceCallback, useLocalStorage } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import {
  DownloadIcon,
  GitHubLogoIcon,
  InfoCircledIcon,
  PlusIcon,
  TrashIcon, UploadIcon,
} from '@radix-ui/react-icons'
import { DarkModeSwitch } from '@/components/organisms/dark-mode-switch'
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
import { RegisteredGuides } from '@/components/flow/guides'
import { ButtonWithTooltip } from '@/components/organisms/button-with-tooltip'
import { ImportButton } from '@/components/organisms/import-button'
import { toast } from 'sonner'
import { Module } from '@/components/flow/modules/types'
import { process } from '@/components/flow/resolvers/process'

type Props = {
  title: string
  nodes: Node<any>[]
  edges: Edge<any>[]
  storageKey?: string // undefined = can't save
  onClickInfo: () => void
}

export function Flow({
  title,
  nodes: initialNodes,
  edges: initialEdges,
  storageKey,
  onClickInfo,
}: Props) {
  const [nodes, setNodes] = React.useState<Node<any>[]>([])
  const [edges, setEdges] = React.useState<Edge<any>[]>([])
  const [saved, setSaved] = useLocalStorage(storageKey ?? '', '')
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance>()

  const debouncedSave = useDebounceCallback((instance: ReactFlowInstance) => {
    if (instance.getNodes().length == 0) {
      return
    }
    setSaved(JSON.stringify(instance.toObject()))
  }, 1000)

  const [modules, nodeTypes] = useModules()

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
    process({
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
    })
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
        data: modules[type].defaultData ?? {},
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
      defaultEdgeOptions={{
        type: 'step',
      }}
      fitView
    >
      <Background className="bg-background" variant={BackgroundVariant.Dots} />
      <Controls />
      <Panel position="top-left" className={'font-mono text-muted-foreground'}>
        <div className={'flex flex-row gap-2 pb-5'}>
          <a
            href={'https://github.com/howyi/visual-cipher'}
            target="_blank"
            className={'text-sm my-auto'}
          >
            <GitHubLogoIcon />
          </a>
          <span className={'text-sm'}>VisualCipher/{title}</span>
        </div>
        <div className={'text-xs'}>Links:</div>
        <ul className={'pl-2 text-xs'}>
          <li>
            <Link className={'hover:text-accent-foreground underline'} to={'/'}>
              Playground
            </Link>
          </li>
          {RegisteredGuides.map((g) => (
            <li key={g.path}>
              <Link
                className={'hover:text-accent-foreground underline'}
                to={g.path}
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel position="bottom-right">
        <Palette />
      </Panel>
      <Panel position="top-right" className={'flex flex-row gap-2 font-mono text-muted-foreground'}>
        {storageKey && (<ButtonWithTooltip
          onClick={(e) => {
            setSaved('')
            window.location.reload()
          }}
          variant={'outline'} tooltip={'reset storage'} size={'sm'}>
          <TrashIcon />
        </ButtonWithTooltip>)}
        {storageKey && <ImportButton onUpload={(file) => {
          setNodes(file.nodes)
          setEdges(file.edges)
          toast("Import succeeded!🎉")
        }} />}
        <ButtonWithTooltip variant={'outline'} tooltip={'export'} size={'sm'} onClick={() => {
          if (!reactFlowInstance) {
            return
          }
          const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(reactFlowInstance.toObject())
          )}`;
          const link = document.createElement("a");
          link.href = jsonString;
          link.download = "visualcipher.json";

          link.click();
        }}>
          <DownloadIcon />
        </ButtonWithTooltip>
        <Button size={'sm'} onClick={onClickInfo}>
          <InfoCircledIcon />
        </Button>
      </Panel>
      <Panel position="bottom-left" className={'mb-36'}>
        <div className={'flex flex-col gap-1'}>
          <DarkModeSwitch />
        </div>
      </Panel>
    </ReactFlow>
  )
}

function Palette() {
  const [open, setOpen] = useState(false)
  const [modules] = useModules()
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/visualcipher', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className={'flex flex-col gap-2 pb-2 w-72 max-h-screen'}>
      {open && (
        <>
          <div className="mt-24">Drag and place the module</div>
          <div className={'h-full overflow-y-scroll flex flex-col gap-2'}>
            {Object.keys(modules).map((key) => {
              const module = modules[key]
              return (
                <ModuleSelector
                  key={key}
                  module={module}
                  onDragStart={onDragStart}
                />
              )
            })}
          </div>
        </>
      )}
      <div className={'text-right'}>
        <Button onClick={() => setOpen(!open)}>
          <PlusIcon /> Add modules
        </Button>
      </div>
    </div>
  )
}

function ModuleSelector({
  module,
  onDragStart,
}: {
  module: Module
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
                        <TableCell>{module.ports.out[id].description}</TableCell>
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
