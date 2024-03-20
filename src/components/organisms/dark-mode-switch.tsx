import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from 'usehooks-ts'

export function DarkModeSwitch() {
  const { enabled, setDarkMode } = useDarkMode()

  return (
    <Button size={'sm'} onClick={() => setDarkMode(!enabled)}>
      {enabled ? '☀' : '☾'}
    </Button>
  )
}

export default function useDarkMode() {
  const [darkMode, setRawDarkMode] = useState(false)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const enabled = useMemo(
    () => darkMode ?? prefersDarkMode,
    [darkMode, prefersDarkMode]
  )

  const setDarkMode = (darkMode: boolean) => {
    window.localStorage.setItem('dark', String(darkMode))
    setRawDarkMode(darkMode)
    if (darkMode) {
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    } else {
      document.body.classList.add('light')
      document.body.classList.remove('dark')
    }
  }

  useEffect(() => {
    setRawDarkMode(window.localStorage.getItem('dark') === 'true')
  }, [])

  return { enabled, setDarkMode }
}
