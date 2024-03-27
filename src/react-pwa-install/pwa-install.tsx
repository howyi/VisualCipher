import React from 'react'
import { useRef, useEffect } from 'react'
// @ts-ignore
import ReactPWAInstall from '@khmyznikov/pwa-install/dist/pwa-install.react.js'
import {
  PWAInstallAttributes,
  PWAInstallElement,
} from '@khmyznikov/pwa-install'
// @ts-ignore
import logo from '@/react-pwa-install/pwa.svg'

const PWAInstall = (props: PWAInstallAttributes) => {
  const pwaInstallRef = useRef<PWAInstallElement>(null)

  return (
    <>
      <ReactPWAInstall ref={pwaInstallRef} {...props} />
      <img
        style={{
          imageRendering: 'pixelated',
        }}
        className={'hover:cursor-pointer'}
        width={200}
        src={logo}
        alt={'launch as Web App'}
        onClick={() => pwaInstallRef.current?.showDialog(true)}
      />
    </>
  )
}

export default PWAInstall
