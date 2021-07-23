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

test('it keeps single 8', () => {
  expect(transformMessage('8')).toBe('8')
})

test('it transforms 2 or more successive 8', () => {
  expect(transformMessage('88')).toBe('ぱちぱち')
  expect(transformMessage('888')).toBe('ぱちぱちぱち')
  expect(transformMessage('8888')).toBe('ぱちぱちぱちぱち')
  expect(transformMessage('88888')).toBe('ぱちぱちぱちぱち')
})

test('it transforms 8 mixed with hiragana', () => {
  expect(transformMessage('おお888')).toBe('おおぱちぱちぱち')
  expect(transformMessage('88すごい')).toBe('ぱちぱちすごい')
})

test('it keeps 8 in a number', () => {
  expect(transformMessage('7889')).toBe('7889')
  expect(transformMessage('889')).toBe('889')
  expect(transformMessage('788')).toBe('788')
})
