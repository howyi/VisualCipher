import React, { ReactNode } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const ButtonWithTooltip = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { tooltip: ReactNode }
>(({ ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...props} />
        </TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
