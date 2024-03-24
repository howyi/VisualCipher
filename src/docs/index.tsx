import React, { ReactNode } from 'react'
import { Top } from '@/docs/top'
import { About } from '@/docs/about'
import { Guide } from '@/components/flow/guides/types'
import { Enigma } from '@/docs/enigma'
import { Vigenere } from '@/docs/vigenere'
import { Caesar } from '@/docs/caesar'
import { Rail } from '@/docs/rail'

type Page = {
  component: ReactNode
  breadcrumbs: string[]
}
export const Pages: { [path in string]: Page } = {
  top: {
    component: <Top />,
    breadcrumbs: [],
  },
  about: {
    component: <About />,
    breadcrumbs: ['top'],
  },
  tips: {
    component: <About />,
    breadcrumbs: ['top'],
  },
  enigma: {
    component: <Enigma />,
    breadcrumbs: ['top_reload'],
  },
  vigenere: {
    component: <Vigenere />,
    breadcrumbs: ['top_reload'],
  },
  caesar: {
    component: <Caesar />,
    breadcrumbs: ['top_reload'],
  },
  rail_fence: {
    component: <Rail />,
    breadcrumbs: ['top_reload'],
  },
}
