import React from 'react'
import { DocumentLink } from '@/docs/document-link'
import { Button } from '@/components/ui/button'
import { Link } from 'gatsby'
import { OpenOnVisualCipherButton } from '@/components/organisms/open-on-visual-cipher-button'
import { GuideWrapper } from '@/docs/guide-wrapper'

export function Enigma() {
  return (
    <GuideWrapper to={'/guides/enigma'}>
      <h1 id="enigma-emulator">Enigma Emulator</h1>
      <p>
        This page uses{' '}
        <a href="https://howyi.github.io/visualcipher/">VisualCipher</a> to
        digitally visualize and reproduce a 3-rotor model of Enigma, the famous
        cryptographic machine used by Nazi Germany during World War II.
        <br />
        The Enigma is known for its unique structure and complex encryption
        process, and through this emulator, users can actually experience the
        behavior of the plugboard, scrambler, and reflector.
      </p>
      <p>
        ※You can add and delete modules on this page, but the settings you
        create are not saved. If you wish to save your work, please use the{' '}
        <a href="https://howyi.github.io/visualcipher/">
          VisualCipher Playground
        </a>{' '}
        .
      </p>
      <h2 id="features">Features</h2>
      <h3 id="plugboard">Plugboard</h3>
      <p>
        Input must be provided in string format with a space per character (e.g.
        [AB CD] will convert A to B and B to A).
      </p>
      <h3 id="scramblers-and-reflectors">Scramblers and Reflectors</h3>
      <p>
        Real scramblers and reflectors are available through the template
        selection. It is also possible to implement original scramblers (and
        reflectors) by writing directly in the wiring field.
      </p>
      <h2 id="how-it-works-">How it works:</h2>
      <p>
        The Enigma Entry Wheel is connected to the rightmost Scrambler and
        rotates with each input. The non-rightmost Scrambler rotates only when
        the Scrambler to its own right passes the Notch.
      </p>
      <h3 id="wiring-settings-">Wiring settings:</h3>
      <h4 id="mappingtype">MappingType</h4>
      <p>
        wiring has TOP (major notation) and BOTTOM (notation that specifies the
        letter to wire to);
      </p>
      <h4 id="ring">Ring</h4>
      <p>represents the wiring when the scrambler is placed </p>
      <h4 id="position">Position</h4>
      <p>sets the initial position of the scrambler.</p>
    </GuideWrapper>
  )
}
