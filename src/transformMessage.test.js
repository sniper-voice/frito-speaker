import { transformMessage } from './transformMessage.js'

test('it transforms a series of w into くさ', () => {
  expect(transformMessage('w')).toBe('くさ')
  expect(transformMessage('ww')).toBe('くさくさ')
  expect(transformMessage('www')).toBe('くさくさくさ')
  expect(transformMessage('wwww')).toBe('くさくさくさ')
  expect(transformMessage('ｗ')).toBe('くさ')
  expect(transformMessage('ｗｗ')).toBe('くさくさ')
  expect(transformMessage('ｗｗｗ')).toBe('くさくさくさ')
  expect(transformMessage('ｗｗｗｗ')).toBe('くさくさくさ')
})

test('it transforms w mixed with hiragana', () => {
  expect(transformMessage('まじかw')).toBe('まじかくさ')
  expect(transformMessage('まじかw くっそウケるんだがwww')).toBe(
    'まじかくさ くっそウケるんだがくさくさくさ'
  )
  expect(transformMessage('ww ちょw')).toBe('くさくさ ちょくさ')
})

test('it keeps w in English words', () => {
  expect(transformMessage('This is an window.')).toBe('This is an window.')
})
