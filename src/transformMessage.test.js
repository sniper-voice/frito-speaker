import { transformMessage } from './transformMessage.js'

test('it transforms a series of w into わら', () => {
  expect(transformMessage('w')).toBe('わら')
  expect(transformMessage('ww')).toBe('わらわら')
  expect(transformMessage('www')).toBe('わらわらわら')
  expect(transformMessage('wwww')).toBe('わらわらわら')
  expect(transformMessage('ｗ')).toBe('わら')
  expect(transformMessage('ｗｗ')).toBe('わらわら')
  expect(transformMessage('ｗｗｗ')).toBe('わらわらわら')
  expect(transformMessage('ｗｗｗｗ')).toBe('わらわらわら')
})

test('it transforms w mixed with hiragana', () => {
  expect(transformMessage('まじかw')).toBe('まじかわら')
  expect(transformMessage('まじかw くっそウケるんだがwww')).toBe(
    'まじかわら くっそウケるんだがわらわらわら'
  )
  expect(transformMessage('ww ちょw')).toBe('わらわら ちょわら')
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
