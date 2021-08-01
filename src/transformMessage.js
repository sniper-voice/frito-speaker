export function transformMessage(message) {
  return message
    .replaceAll(
      /([^a-zA-Zａ-ｚＡ-Ｚ]|^)([wｗ]+)([^a-zA-Zａ-ｚＡ-Ｚ]|$)/g,
      (match, p1, p2, p3) => {
        return p1 + 'わら'.repeat(Math.min(p2.length, 3)) + p3
      }
    )
    .replaceAll(/([^\d]|^)(88+)([^\d]|$)/g, (match, p1, p2, p3) => {
      return p1 + 'ぱち'.repeat(Math.min(p2.length, 4)) + p3
    })
}
