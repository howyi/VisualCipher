import { useEffect, useState } from 'react'

type Steam = {
  name: string
  activateAchievement: (name: string) => Promise<void>
}

export function useSteam(): Steam | undefined {
  const [steam, setSteam] = useState<Steam>()
  useEffect(() => {
    new Promise(async () => {
      // @ts-ignore
      if (!window.steam) {
        setSteam(undefined)
        return
      }
      // @ts-ignore
      const isEnabled = await window.steam.isEnabled()
      if (!isEnabled) {
        setSteam(undefined)
        return
      }
      // @ts-ignore
      const name = await window?.steam?.getName()
      setSteam({
        name,
        // @ts-ignore
        activateAchievement: window?.steam?.activateAchievement,
      })
    }).then()
  }, [])
  return steam
}
