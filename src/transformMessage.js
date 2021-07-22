export function transformMessage(message) {
  return message.replaceAll(
    /([^a-zA-Zａ-ｚＡ-Ｚ]|^)([wｗ]+)([^a-zA-Zａ-ｚＡ-Ｚ]|$)/g,
    (match, p1, p2, p3) => {
      return p1 + 'くさ'.repeat(Math.min(p2.length, 3)) + p3
    }
  )
}
