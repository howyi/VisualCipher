import { StringShift } from '@/components/flow/utils/string-shift'
import { expect, test } from 'vitest'

test('No Shift', () => {
  // 4,0 -> 0
  expect(StringShift('ABCD', 0)).toStrictEqual('ABCD')
})

test('Normal Right Shift', () => {
  // 4,1 -> 1
  expect(StringShift('ABCD', 1)).toStrictEqual('DABC')
})

test('Right 1Cycle Shift', () => {
  // 4,4 -> 0
  expect(StringShift('ABCD', 4)).toStrictEqual('ABCD')
})

test('Right Over Shift', () => {
  // 4,5 -> 1
  expect(StringShift('ABCD', 5)).toStrictEqual('DABC')
})

test('Normal Left Shift', () => {
  // 4,-1 -> -1
  expect(StringShift('ABCD', -1)).toStrictEqual('BCDA')
})

test('Left 1Cycle Shift', () => {
  // 4,-4 -> 0
  expect(StringShift('ABCD', -4)).toStrictEqual('ABCD')
})

test('Left Over Shift', () => {
  // 4,-5 -> -1
  expect(StringShift('ABCD', -5)).toStrictEqual('BCDA')
})
