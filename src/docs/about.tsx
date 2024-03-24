import React from 'react'

export function About() {
  return (
    <>
      <h1 id="visualcipher-playground">VisualCipher</h1>
      <p>
        VisualCipher is a web app that visually represents various cryptographic
        techniques using an intuitive node-based system. The app allows users to
        learn how cryptography works and build their own encryption workflows.
        <br />
        created by <a href="https://twitter.com/howyi_lq">@howyi_lq</a>.{' '}
      </p>
      <p>
        Drag and drop cipher modules together and explore the fascinating world
        of ciphers from ancient to modern times.
      </p>
      <h2 id="features-">Features:</h2>
      <h3 id="wide-range-of-encryption-and-decryption-experiences">
        Wide range of encryption and decryption experiences
      </h3>
      <p>
        freely manipulate encryption technologies through the ages, starting
        with the Caesar cipher and ending with the complex Enigma cipher
        machine.
      </p>
      <h3 id="real-time-text-highlighting">Real-time text highlighting</h3>
      <p>
        Input text is highlighted in real-time, providing a clear visual
        representation of each encryption and decryption process.
      </p>
      <h3 id="in-browser-data-saving">In-browser data saving</h3>
      <p>
        All editing operations in &quot;VisualCipher Playground&quot; are saved
        in the browser, so you can stop working at any time and continue later.
      </p>
      <h3 id="easy-addition-of-modules">Easy addition of modules</h3>
      <p>
        You can further extend your encryption experience by adding new cipher
        modules via the button in the lower right corner.
      </p>
      <h3 id="fully-client-side">Fully client-side</h3>
      <p>
        All processing is done on the client side, with no communication with
        the server. Privacy and security are preserved.
      </p>
      <h3 id="open-source">Open-source</h3>
      <p>
        VisualCipher is developed as an open source project and the source code
        is available on GitHub. New modules and feature improvement commits by
        the community are welcome.
      </p>
    </>
  )
}
