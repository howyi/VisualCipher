import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Guide } from '@/components/templates/guide'

const IndexPage: React.FC<PageProps> = () => {
  return <Guide path={'/guides/vigenere'} documentPath={'vigenere'} />
}

export default IndexPage

export const Head: HeadFC = () => <title>Vigenère cipher | VisualCipher</title>
