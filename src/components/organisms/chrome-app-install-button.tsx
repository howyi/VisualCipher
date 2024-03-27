import * as React from 'react'
import PWAInstall from '@/react-pwa-install/pwa-install'

export function ChromeAppInstallButton() {
  return <PWAInstall manifest-url="/manifest.webmanifest" />
}
