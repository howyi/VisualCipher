import React from 'react'
import { DocumentLink } from '@/docs/document-link'
import { Button } from '@/components/ui/button'
import { Link } from 'gatsby'
import { OpenOnVisualCipherButton } from '@/components/organisms/open-on-visual-cipher-button'
import { GuideWrapper } from '@/docs/guide-wrapper'

export function Caesar() {
  return (
    <GuideWrapper to={'/guides/caesar'}>
      <h1 id="caesar-cipher">Caesar cipher</h1>
      <p>
        Caesar cipher is a classic encryption technique that encrypts a document
        by shifting a certain number of letters in the alphabet. The basis of
        this technique is to shift each letter of the plaintext forward or
        backward a certain number of letters on the alphabet. Decryption
        involves moving the same number of letters in the opposite direction of
        the shift made in encryption.
      </p>
      <h2 id="encryption-method">Encryption Method</h2>
      <ol>
        <li>
          <p>
            Select the number of shifts: First, determine the number of
            alphabetic shifts. For example, if the number of shifts is 3,
            &#39;A&#39; becomes &#39;D&#39; and &#39;B&#39; becomes &#39;E&#39;.
          </p>
        </li>
        <li>
          <p>
            Text Encryption: Shifts each character of the plaintext
            alphabetically by the selected number of shifts and replaces it with
            a new character. If the end of the alphabet is reached, it returns
            to the beginning of the alphabet.
          </p>
        </li>
      </ol>
      <h2 id="decryption-method">Decryption Method</h2>
      <ol>
        <li>
          <p>
            Apply Shift Number: Apply the number of shifts used for encryption
            in reverse order.
          </p>
        </li>
        <li>
          <p>
            Text Decryption: Shifts each character of the ciphertext backward in
            alphabetical order by the selected number of shifts, restoring the
            original plaintext.
          </p>
        </li>
      </ol>
      <h1 id="rot13">ROT13</h1>
      <p>
        ROT13 is a type of Caesar cipher with a fixed number of shifts of 13.
        <br />
        With this number of shifts, the encryption and decryption operations are
        the same.
        <br />
        In other words, applying ROT13 twice to any text restores the original
        text; ROT13 is often used to lightly conceal text content (e.g., to hide
        spoilers or offensive content) rather than to encrypt it.
        <br />
        For example, applying ROT13 to &#39;HELLO&#39; will result in
        &#39;MURYYY&#39;, and applying ROT13 again will result in the original
        &#39;HELLO&#39;.
      </p>
      <p>
        Although ROT13 is easily deciphered and not suitable for security
        purposes, it is often used as an interesting example to learn the basics
        of programming and cryptography.
      </p>
    </GuideWrapper>
  )
}
