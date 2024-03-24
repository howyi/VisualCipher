import React from 'react'
import { GuideWrapper } from '@/docs/guide-wrapper'

export function Rail() {
  return (
    <GuideWrapper to={'/guides/rail'}>
      <h1 id="rail-fence-cipher">Rail fence cipher</h1>
      <p>
        Rail Fence Cipher is a simple method of encryption and decryption in
        which text is placed along a waveform (zigzag pattern) that travels
        downward and upward while writing diagonally, and then read line by
        line.
      </p>
      <h3 id="encryption-method">Encryption Method</h3>
      <ol>
        <li>
          <p>
            Determine the number of rails (rows): First, determine how many rows
            (rails) you want to encrypt the text. This is the key.
          </p>
        </li>
        <li>
          <p>
            Create a wave pattern: Write the text to be encrypted in a zigzag
            pattern according to the number of rails you have determined. Start
            from the top down, and when you reach the bottom, change direction
            and go back up. This is repeated until the end of the text.
          </p>
        </li>
        <li>
          <p>
            Generate cipher text: The text written on each rail is read from the
            top and concatenated to generate the cipher text.
          </p>
        </li>
      </ol>
      <h3 id="decryption-method">Decryption Method</h3>
      <ol>
        <li>
          <p>
            Use the number of rails: Start the decryption process based on the
            number of rails used for encryption.
          </p>
        </li>
        <li>
          <p>
            Estimate the wave pattern: Estimates the wave pattern with which the
            original text was arranged based on the length of the ciphertext and
            the number of rails.
          </p>
        </li>
        <li>
          <p>
            Placing the ciphertext: Places the ciphertext on the rails according
            to the estimated waveform pattern.
          </p>
        </li>
        <li>
          <p>
            Plain text reading: Recovers the original text (plain text) by
            reading the characters along the zigzag pattern.
          </p>
        </li>
      </ol>
    </GuideWrapper>
  )
}
