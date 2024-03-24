import React, { PropsWithChildren } from 'react'
import { useDocumentPathStore } from '@/docs/use-document-path'

export function DocumentLink({
  to,
  children,
}: { to: string } & PropsWithChildren) {
  const move = useDocumentPathStore((state) => state.set)
  return (
    <a
      className={'hover:cursor-pointer text-primary-foregroun underline'}
      onClick={() => move(to)}
    >
      {children}
    </a>
  )
}
