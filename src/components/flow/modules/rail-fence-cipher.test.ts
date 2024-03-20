import { RailFenceCipherEncrypt } from '@/components/flow/modules/rail-fence-cipher'

test('Encrypt', () => {
  // R   F   E   H
  //  A L E C C P E
  //   I   N   I   R
  expect(RailFenceCipherEncrypt('RAILFENCECIPHER', 3)).toStrictEqual({
    encrypted: 'RFEH ALECCPE INIR',
  })
})
