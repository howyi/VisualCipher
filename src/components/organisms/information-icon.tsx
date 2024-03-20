import { InfoCircledIcon } from '@radix-ui/react-icons'
import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { RichTextEditor } from '@/components/organisms/rich-text-editor'

export function InformationIcon({ information }: { information: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoCircledIcon />
      </HoverCardTrigger>
      <HoverCardContent className="nodrag w-80 absolute prose dark:prose-invert">
        <RichTextEditor editable={false} content={information} />
      </HoverCardContent>
    </HoverCard>
  )
}
