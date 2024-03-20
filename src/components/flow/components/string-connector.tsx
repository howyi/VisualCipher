export function StringConnector({
  top,
  bottom,
}: {
  top?: number
  bottom?: number
}) {
  if (top === undefined || bottom === undefined) {
    return ' '
  }
  if (top < 0 || bottom < 0) {
    return ' '
  }
  if (top === bottom) {
    return ' '.repeat(top) + '│'
  }
  if (top < bottom) {
    return ' '.repeat(top) + '└' + '─'.repeat(bottom - 1 - top) + '┐'
  }
  if (top > bottom) {
    return ' '.repeat(bottom) + '┌' + '─'.repeat(top - 1 - bottom) + '┘'
  }
}
