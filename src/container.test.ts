import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { Container } from './container'
import { token } from './token'
import type { NewAble } from './types'

describe('Container using symbols', () => {
  let container: Container

  const exampleSymbol = token<string>('example') // Symbol.for('example')
  const stringToken = token<string>('exampleStr')

  beforeEach(() => {
    container = new Container()
  })

  test('can bind a factory', () => {
    let count = 1
    container
      .bind<string>(exampleSymbol)
      .toFactory(() => `hello world ${count++}`)
      .transient()

    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 2')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 3')

    container
      .bind(stringToken)
      .toFactory(() => `hello world ${count++}`)
      .transient()

    expect(container.get(stringToken)).toBe('hello world 4')
    expect(container.get(stringToken)).toBe('hello world 5')
    expect(container.get(stringToken)).toBe('hello world 6')
  })

  test('can bind a factory in singleton scope', () => {
    let count = 1
    container
      .bind<string>(exampleSymbol)
      .toFactory(() => `hello world ${count++}`)
      .inSingletonScope()

    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')

    count = 1
    container
      .bind(stringToken)
      .toFactory(() => `hello world ${count++}`)
      .inSingletonScope()

    expect(container.get(stringToken)).toBe('hello world 1')
    expect(container.get(stringToken)).toBe('hello world 1')
    expect(container.get(stringToken)).toBe('hello world 1')
  })

  test('should use cached data in singleton scope', () => {
    const spy = mock()
    spy.mockReturnValue('test')

    container.bind<string>(exampleSymbol).toFactory(spy).inSingletonScope()

    container.get(exampleSymbol)
    container.get(exampleSymbol)
    container.get(exampleSymbol)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(container.get<string>(exampleSymbol)).toBe('test')
  })

  test('can bind a constructable', () => {
    interface IExampleConstructable {
      hello(): string
    }
    const exampleSymbol = token<IExampleConstructable>('example')
    container
      .bind<IExampleConstructable>(exampleSymbol)
      .to(
        class implements IExampleConstructable {
          count = 1
          hello() {
            return `world ${this.count++}`
          }
        },
      )
      .transient()

    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')

    const exampleToken = token<IExampleConstructable>('example')

    container
      .bind<IExampleConstructable>(exampleToken)
      .to(
        class implements IExampleConstructable {
          count = 1
          hello() {
            return `world ${this.count++}`
          }
        },
      )
      .transient()

    expect(container.get(exampleToken).hello()).toBe('world 1')
    expect(container.get(exampleToken).hello()).toBe('world 1')
    expect(container.get(exampleToken).hello()).toBe('world 1')
  })

  test('can bind a constructable in singleton scope', () => {
    interface IExampleConstructable {
      hello(): string
    }

    const exampleSymbol = token<IExampleConstructable>('example')
    container
      .bind<IExampleConstructable>(exampleSymbol)
      .to(
        class implements IExampleConstructable {
          count = 1
          hello() {
            return `world ${this.count++}`
          }
        },
      )
      .inSingletonScope()

    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 2')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 3')
  })

  test('can bind a constant value', () => {
    container.bind<string>(exampleSymbol).toValue('constant world')
    expect(container.get<string>(exampleSymbol)).toBe('constant world')

    container.bind(stringToken).toValue('constant world')
    expect(container.get(stringToken)).toBe('constant world')
  })

  test('can bind a constant value of zero', () => {
    const exampleSymbol = token<number>('example')
    container.bind<number>(exampleSymbol).toValue(0)
    expect(container.get(exampleSymbol)).toBe(0)

    const numToken = token<number>('number')
    container.bind(numToken).toValue(0)
    expect(container.get(numToken)).toBe(0)
  })

  test('can bind a negative constant value', () => {
    const exampleSymbol = token<number>('example')
    container.bind<number>(exampleSymbol).toValue(-10)
    expect(container.get(exampleSymbol)).toBe(-10)
  })

  test('can bind a function value', () => {
    const exampleSymbol = token<(str: string) => string>('example')
    container.bind<(str: string) => string>(exampleSymbol).toValue((str: string) => `hello ${str}`)
    expect(container.get<(str: string) => string>(exampleSymbol)('world')).toBe('hello world')
  })

  test('can bind a constructable value', () => {
    class HelloWorld {}
    const exampleSymbol = token<NewAble<HelloWorld>>('example')
    container.bind<NewAble<HelloWorld>>(exampleSymbol).toValue(HelloWorld)
    expect(new (container.get<NewAble<HelloWorld>>(exampleSymbol))()).toBeInstanceOf(HelloWorld)
  })

  test('can bind a constant value of empty string', () => {
    container.bind<string>(exampleSymbol).toValue('')
    expect(container.get<string>(exampleSymbol)).toBe('')
  })

  test('can not bind a constant value of undefined', () => {
    const exampleSymbol = token<undefined>('example')
    expect(() => container.bind(exampleSymbol).toValue(undefined)).toThrow('cannot bind a value of type undefined')
  })

  test('can not bind to a symbol more than once', () => {
    container.bind(exampleSymbol)
    expect(() => container.bind(exampleSymbol)).toThrow('object can only bound once: Symbol(example)')
  })

  test('can not bind to a token more than once', () => {
    container.bind(stringToken)
    expect(() => container.bind(stringToken)).toThrow('object can only bound once: Symbol(exampleStr)')
  })

  test('can not get unbound dependency', () => {
    container.bind(exampleSymbol)
    expect(() => container.get<string>(exampleSymbol)).toThrow('nothing bound to Symbol(example)')
  })

  test('can rebind to a symbol', () => {
    container.bind<string>(exampleSymbol).toValue('hello world')
    expect(container.get(exampleSymbol)).toBe('hello world')

    container.rebind<string>(exampleSymbol).toValue('good bye world')
    expect(container.get(exampleSymbol)).toBe('good bye world')
  })

  test('can only rebind to a symbol if it was bound before', () => {
    expect(() => container.rebind(exampleSymbol)).toThrow('Symbol(example) was never bound')
  })

  test('can remove a symbol', () => {
    container.bind<string>(exampleSymbol).toValue('hello world')
    expect(container.get(exampleSymbol)).toBe('hello world')

    container.remove(exampleSymbol)
    expect(() => container.get(exampleSymbol)).toThrow('nothing bound to Symbol(example)')
  })

  test('can snapshot and restore the registry', () => {
    container.bind<string>(exampleSymbol).toValue('hello world')
    expect(container.get(exampleSymbol)).toBe('hello world')

    container.snapshot()
    container.rebind<string>(exampleSymbol).toValue('after first snapshot')
    expect(container.get(exampleSymbol)).toBe('after first snapshot')

    container.snapshot()
    container.rebind<string>(exampleSymbol).toValue('after second snapshot')
    expect(container.get(exampleSymbol)).toBe('after second snapshot')

    container.snapshot()
    container.rebind<string>(exampleSymbol).toValue('after fourth snapshot')
    expect(container.get(exampleSymbol)).toBe('after fourth snapshot')

    container.restore()
    expect(container.get(exampleSymbol)).toBe('after second snapshot')

    container.restore()
    expect(container.get(exampleSymbol)).toBe('after first snapshot')

    container.restore()
    expect(container.get(exampleSymbol)).toBe('hello world')

    container.restore()
    expect(container.get(exampleSymbol)).toBe('hello world')
  })
})
