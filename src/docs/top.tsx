import React from 'react'
import { DocumentLink } from '@/docs/document-link'
import { Link } from 'gatsby'
import { ChromeAppInstallButton } from '@/components/organisms/chrome-app-install-button'

export function Top() {
  return (
    <>
      <h1>VisualCipher Playground</h1>
      <p>
        {/* VisualCipherは、多様な暗号技術をノードベースの直感的なシステムを用いて視覚的に表現するウェブアプリです。このアプリを利用することで、暗号の仕組みを学習したり、独自の暗号化ワークフローを構築することが可能になります。 */}
        VisualCipher is a web app that visually represents various cryptographic
        techniques using an intuitive node-based system. The app enables users
        to learn how cryptography works and build their own encryption workflow.
      </p>
      <p>
        In the VisualCipher Playground (that's the page you have open right
        now), you can add modules at will. Data is stored in the browser's
        localstorage and can be input or output in JSON.
      </p>
      <ChromeAppInstallButton />
      <h2>Introduction</h2>
      <ul>
        <li>
          <DocumentLink to={'about'}>About "VisualCipher"</DocumentLink>
        </li>
        {/*<li>*/}
        {/*  <DocumentLink to={'tips'}>TIPS</DocumentLink>*/}
        {/*</li>*/}
        <li>
          Cipher guides
          <ul>
            <li>
              <Link to={'/guides/enigma'}>Enigma Emulator</Link>
            </li>
            <li>
              <Link to={'/guides/rail'}>Rail fence cipher</Link>
            </li>
            <li>
              <Link to={'/guides/caesar'}>Caesar cipher</Link>
            </li>
            <li>
              <Link to={'/guides/vigenere'}>Vigenère cipher</Link>
            </li>
          </ul>
        </li>
      </ul>
      <h2>Join the community</h2>
      <ul>
        <li>
          We accept bug reports, suggestions for new features, and even code
          commits on GitHub. If you are interested in contributing to the
          project, please visit the{' '}
          <a href={'https://github.com/howyi/VisualCipher'} target={'_blank'}>
            GitHub repository.
          </a>
        </li>
        <li>
          <a href={'https://twitter.com/howyi_lq'} target={'_blank'}>
            Follow author X for the latest updates and information!
          </a>
        </li>
      </ul>
    </>
  )
}
