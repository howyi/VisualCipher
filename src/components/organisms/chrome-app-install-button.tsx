import * as React from 'react'
import { Button } from '@/components/ui/button'

export function ChromeAppInstallButton() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = React.useState(false)

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true)
    }
  }, [prompt])

  if (!isVisible) {
    return <div />
  }

  return <Button onClick={promptToInstall}>Install Desktop App</Button>
}

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void,
] {
  const [prompt, setState] = React.useState<IBeforeInstallPromptEvent | null>(
    null
  )

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    )
  }

  React.useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setState(e)
    }

    window.addEventListener('beforeinstallprompt', ready as any)

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any)
    }
  }, [])

  return [prompt, promptToInstall]
}
