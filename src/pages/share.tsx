import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Edge, Node, ReactFlowJsonObject } from 'reactflow'
import { FlowTemplate } from '@/components/templates/flow'
import { useEffect, useState } from 'react'

type FlowData = {
  nodes: Node[]
  edges: Edge[]
}
const IndexPage: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search)

  const encodedJson = params.get('json')

  if (!encodedJson) {
    // redirect
    return 'loading'
  }

  const decoded = decodeURIComponent(encodedJson)
  const data = JSON.parse(decoded) as ReactFlowJsonObject

  return (
    <FlowTemplate
      title={'Share'}
      nodes={data.nodes}
      edges={data.edges}
      documentOpen={false}
      documentPath={'top'}
      isPlayground={false}
    />
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>VisualCipher</title>
