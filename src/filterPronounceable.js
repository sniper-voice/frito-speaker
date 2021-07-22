// http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
const acceptCharacterClass =
  // latin alphabet
  'a-zA-Z' +
  // odoriji
  '\u3005\u309d\u30fd\u309e\u30fe\u30eb\u303b\u3031-\u3035' +
  // hiragana
  '\u3041-\u3096' +
  // katakana
  '\u30a1-\u30f6' +
  // zenkaku suuji
  '\uff10-\uff19' +
  // zenkaku latin alphabet(upper case)
  '\uff21-\uff2a' +
  // zenkaku latin alphabet(lower case)
  '\uff41-\uff5a' +
  // hankakukana
  '\uff66-\uff9f' +
  // kanji
  '\u4e00-\u9faf\u3400-\u4dbf' +
  // pronounceable symbols
  '?!？！＋－＝'

const charactersRejected = new RegExp(`[^${acceptCharacterClass}]`, 'g')

export function filterPronounceable(message) {
  return message.replaceAll(charactersRejected, '')
}
