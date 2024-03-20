export function StringShift(text: string, shift: number) {
  const sliceIndex = shift % text.length
  return text.slice(-sliceIndex) + text.slice(0, -sliceIndex)
}
