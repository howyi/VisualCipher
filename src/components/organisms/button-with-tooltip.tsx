import React, { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { useMediaQuery } from 'usehooks-ts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const ButtonWithTooltip = React.forwardRef<HTMLButtonElement, ButtonProps & {tooltip: ReactNode}>(
  ({...props}, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button ref={ref} {...props} />
          </TooltipTrigger>
          <TooltipContent>
            {props.tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)