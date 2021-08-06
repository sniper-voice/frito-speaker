const properNounMap = {
  言峰空也: 'ことみねくうや',
  南月: 'なつき',
  女狐リラ: 'めぎつねりら',
}

const properNounsMatcher = new RegExp(Object.keys(properNounMap).join('|'), 'g')

export function transformMessage(message) {
  return message
    .replace(properNounsMatcher, (match) => {
      return properNounMap[match]
    })
    .replace(
      /([^a-zA-Zａ-ｚＡ-Ｚ]|^)([wｗ]+)([^a-zA-Zａ-ｚＡ-Ｚ]|$)/g,
      (match, p1, p2, p3) => {
        return p1 + 'わら'.repeat(Math.min(p2.length, 3)) + p3
      }
    )
    .replace(/([^\d]|^)(88+)([^\d]|$)/g, (match, p1, p2, p3) => {
      return p1 + 'ぱち'.repeat(Math.min(p2.length, 4)) + p3
    })
    .replace(/prpr/g, 'ぺろぺろ')
    .replace(/kwsk/g, 'くわしく')
}
