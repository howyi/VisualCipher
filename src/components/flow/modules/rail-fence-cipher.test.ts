import { RailFenceCipherEncrypt } from '@/components/flow/modules/rail-fence-cipher'
import { expect, test } from 'vitest'

// RFEH
// ALECCPE
// INIR
test('Encrypt', () => {
  // R   F   E   H
  //  A L E C C P E
  //   I   N   I   R
  expect(RailFenceCipherEncrypt('RAILFENCECIPHER', 3, false)).toStrictEqual({
    output: 'RFEH ALECCPE INIR',
    linesWithSpan: ['R   F   E   H', ' A L E C C P E', '  I   N   I   R'],
  })
})

test('Decrypt', () => {
  // R   F   E   H
  //  A L E C C P E
  //   I   N   I   R
  expect(RailFenceCipherEncrypt('RFEH ALECCPE INIR', 3, true)).toStrictEqual({
    output: 'RAILFENCECIPHER',
    linesWithSpan: ['R   F   E   H', ' A L E C C P E', '  I   N   I   R'],
  })
})
