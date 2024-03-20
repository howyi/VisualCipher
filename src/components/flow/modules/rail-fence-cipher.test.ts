import { RailFenceCipherEncrypt } from '@/components/flow/modules/rail-fence-cipher'
import { expect, test } from 'vitest'

test('Encrypt', () => {
  // R   F   E   H
  //  A L E C C P E
  //   I   N   I   R
  expect(RailFenceCipherEncrypt('RAILFENCECIPHER', 3)).toStrictEqual({
    encrypted: 'RFEH ALECCPE INIR',
  })
})
