import { expect, test } from 'vitest'
import { AffineCipherEncrypt } from '@/components/flow/modules/affine-cipher'

test('Encrypt', () => {
  expect(
    AffineCipherEncrypt('AFFINE CIPHER', 5, 8, false).output
  ).toStrictEqual('IHHWVC SWFRCP')
})

test('Decrypt', () => {
  expect(AffineCipherEncrypt('IHHWVC SWFRCP', 5, 8, true).output).toStrictEqual(
    'AFFINE CIPHER'
  )
})
