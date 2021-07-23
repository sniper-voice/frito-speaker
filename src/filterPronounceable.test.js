import { filterPronounceable } from './filterPronounceable.js'

test('it passes hiragana', () => {
  const hiraganaCharacters =
    'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわをん'
  expect(filterPronounceable(hiraganaCharacters)).toBe(hiraganaCharacters)
})

test('it passes katakana', () => {
  const hiraganaCharacters =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワヲン'
  expect(filterPronounceable(hiraganaCharacters)).toBe(hiraganaCharacters)
})

test('it passes hankaku-kana', () => {
  const hankakukanaCharacters = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾜｦﾝ'
  expect(filterPronounceable(hankakukanaCharacters)).toBe(hankakukanaCharacters)
})

test('it passes odoriji', () => {
  const odorijiSet = '々ゝヽゞヾ〻〳〴〵〱〲'
  expect(filterPronounceable(odorijiSet)).toBe(odorijiSet)
})

test('it drops Japanese punctuati', () => {
  const japaneseSymbols = '〒〆'
  expect(filterPronounceable(japaneseSymbols)).toBe('')
})

test('it passes latin alphabet', () => {
  const latinAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  expect(filterPronounceable(latinAlphabet)).toBe(latinAlphabet)
})

test('it passes numbers', () => {
  const numbers = '0123456789０１２３４５６７８９'
  expect(filterPronounceable(numbers)).toBe(numbers)
})

test('it passes long tone symbol', () => {
  expect(filterPronounceable('エール')).toBe('エール')
})

test('it sanitizes ascii arts', () => {
  expect(filterPronounceable('(*･ω･ﾉﾉﾞ☆ﾊﾟﾁﾊﾟﾁﾊﾟﾁﾊﾟﾁ')).toBe('ﾉﾉﾞﾊﾟﾁﾊﾟﾁﾊﾟﾁﾊﾟﾁ')
  expect(filterPronounceable('(*´▽`ﾉﾉﾊﾟﾁﾊﾟﾁ☆ﾟ･:*｡+.♪')).toBe('ﾉﾉﾊﾟﾁﾊﾟﾁﾟ')
})

test('it passes exclamation mark', () => {
  expect(filterPronounceable('やったー!！')).toBe('やったー!！')
})

test('it passes question mark', () => {
  expect(filterPronounceable('やったー？?')).toBe('やったー？?')
})
