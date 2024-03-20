import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ButtonWithTooltip } from '@/components/organisms/button-with-tooltip'
import { UploadIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { ChangeEventHandler, useState } from 'react'
import { ReactFlowJsonObject } from 'reactflow'
import { useBoolean } from 'usehooks-ts'

type Props = {
  onUpload: (file: ReactFlowJsonObject) => void
}
export function ImportButton({onUpload}: Props) {
  const open = useBoolean(false)
  const [json, setJson] = useState<ReactFlowJsonObject>();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = event => {
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

  return <Dialog open={open.value} onOpenChange={open.setValue}>
    <DialogTrigger asChild>
      <ButtonWithTooltip variant={'outline'} tooltip={'import'} size={'sm'}>
        <UploadIcon />
      </ButtonWithTooltip>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload</DialogTitle>
      </DialogHeader>
      <div className="">
        <Label htmlFor="import" className="text-right">
          Select .json file
        </Label>
        <Input
          onChange={handleChange}
          id="import"
          type={'file'}
        />
      </div>
      <DialogFooter>
        <Button disabled={!json} onClick={Import}>Import</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}