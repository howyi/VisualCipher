import { Button } from '@/components/ui/button'
import { Link } from 'gatsby'
import React from 'react'

export function OpenOnVisualCipherButton({ to }: { to: string }) {
  return (
    <Link to={to}>
      <Button variant={'accent'} className={'my-2'}>
        Open on VisualCipher
      </Button>
    </Link>
  )
}
