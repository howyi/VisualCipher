import React from 'react'
import { GuideWrapper } from '@/docs/guide-wrapper'

export function Vigenere() {
  return (
    <GuideWrapper to={'/guides/vigenere'}>
      <h1 id="vigen-re-cipher">Vigenère cipher</h1>
      <p>
        The Vigenel cipher is a type of polyalphabetic cipher named after Blaise
        de Vigenère, a 16th century French cryptographer. This encryption method
        uses multiple Caesar cipher shifts to encrypt a single text, creating a
        cipher that is more difficult to decipher than a cipher based on a
        single shift.
      </p>
      <h2 id="encryption-method">Encryption Method</h2>
      <p>
        Keyword Selection: The Vigenere cipher requires the same keyword for the
        encryption and decryption processes. This keyword can be an arbitrary
        string of the same length or shorter than the text to be encrypted.
      </p>
      <ol>
        <li>
          <p>
            Repeat Keyword: If the keyword is shorter than the text, the keyword
            is repeated to match the length of the text.
          </p>
        </li>
        <li>
          <p>
            Alphabetic Shift: Each character of the text is transformed
            according to the amount of shift on the alphabet indicated by the
            corresponding character of the keyword. For example, if the keyword
            letter is &#39;A&#39;, the shift is 0, &#39;B&#39; is 1, and so on.
          </p>
        </li>
        <li>
          <p>
            Ciphertext generation: Each character of the text is transformed
            according to the above shift to generate a new string (ciphertext).
          </p>
        </li>
      </ol>
      <h2 id="decryption-method">Decryption Method</h2>
      <p>Decryption is the reverse process of encryption.</p>
      <ol>
        <li>
          <p>
            Keyword Preparation: Prepare the same keywords used for encryption.
          </p>
        </li>
        <li>
          <p>
            Keyword repetition: Repeat the keywords as necessary to match the
            length of the ciphertext.
          </p>
        </li>
        <li>
          <p>
            Reverse Alphabetic Shift: Shifts each letter of the ciphertext in
            the opposite direction of the amount of shift on the alphabet
            indicated by the corresponding letter of the keyword. For example,
            if the shift by the letter of the keyword was 1, a shift of -1 is
            applied in decryption.
          </p>
        </li>
      </ol>
      <p>
        In the Vigenere cipher, the more random and long the keywords are, and
        the longer they are the same length as the text, the more difficult it
        is to decipher. This provides a higher degree of security, but keyword
        management is critical.
      </p>
    </GuideWrapper>
  )
}
