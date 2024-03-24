import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ButtonWithTooltip } from '@/components/organisms/button-with-tooltip'
import { GearIcon, UploadIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { ChangeEventHandler, useState } from 'react'
import { ReactFlowJsonObject } from 'reactflow'
import { useBoolean } from 'usehooks-ts'
import { useDarkMode } from '@/components/organisms/dark-mode-switch'

type Props = {
  storageKey?: string
  onUpload: (file: ReactFlowJsonObject) => void
  onDownload: () => void
  onReset: () => void
}
export function SettingButton({
  storageKey,
  onUpload,
  onDownload,
  onReset,
}: Props) {
  const open = useBoolean(false)
  const { enabled, setDarkMode } = useDarkMode()
  const [json, setJson] = useState<ReactFlowJsonObject>()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      try {
        const jsonData = JSON.parse(content as string) as ReactFlowJsonObject
        setJson(jsonData)
      } catch (error) {
        console.error('invalid file', error)
      }
    }
    reader.readAsText(file)
  }

  const Import = () => {
    if (json) {
      onUpload(json)
      open.setFalse()
    }
  }

  return (
    <Dialog open={open.value} onOpenChange={open.setValue}>
      <DialogTrigger asChild>
        <ButtonWithTooltip variant={'outline'} tooltip={'import'} size={'sm'}>
          <GearIcon />
        </ButtonWithTooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Button size={'sm'} onClick={() => setDarkMode(!enabled)}>
          {enabled ? '☀ Switch to light mode' : '☾ Switch to dark mode'}
        </Button>
        <Button className={'w-full'} onClick={onDownload}>
          Export json file
        </Button>

        {storageKey && (
          <>
            <div className="">
              <Label htmlFor="import" className="text-right">
                Import from json file
              </Label>
              <div className={'flex flex-row gap-2'}>
                <Input onChange={handleChange} id="import" type={'file'} />
                <Button disabled={!json} onClick={Import}>
                  Import
                </Button>
              </div>
            </div>
            <Button
              variant={'destructive'}
              className={'w-full'}
              onClick={onReset}
            >
              Reset localStorage
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
