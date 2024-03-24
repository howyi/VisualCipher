import { RegisteredGuides } from '@/components/flow/guides'
import { FlowTemplate } from '@/components/templates/flow'
import * as React from 'react'

export function Guide({
  path,
  documentPath,
}: {
  path: string
  documentPath: string
}) {
  const guide = RegisteredGuides.find((g) => g.path === path)
  if (!guide) {
    return
  }
  return (
    <FlowTemplate
      title={guide.title}
      nodes={guide.initialNodes}
      edges={guide.initialEdges}
      documentOpen={true}
      documentPath={documentPath}
    />
  )
}
