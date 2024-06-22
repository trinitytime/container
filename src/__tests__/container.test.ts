import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { Container } from '../container'


describe('Container using symbols', () => {
  let container: Container

  const exampleSymbol = Symbol.for('example') 
  const stringToken ='exampleStr'

  beforeEach(() => {
    container = new Container()
  })

  test('can bind a factory', () => {
    let count = 1
    container.bind<string>(exampleSymbol, () => `hello world ${count++}`)
    container.meta(exampleSymbol, { transient: true })

    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 2')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 3')


    container.bind<string>(stringToken, () => `hello world ${count++}`)
    container.meta(stringToken, { transient: true })


    expect(container.get<string>(stringToken)).toBe('hello world 4')
    expect(container.get<string>(stringToken)).toBe('hello world 5')
    expect(container.get<string>(stringToken)).toBe('hello world 6')
  })

  test('can bind a factory in singleton scope', () => {
    let count = 1
    container.bind<string>(exampleSymbol, () => `hello world ${count++}`)


    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')
    expect(container.get<string>(exampleSymbol)).toBe('hello world 1')

    count = 1
    container.bind<string>(stringToken, () => `hello world ${count++}`)

    expect(container.get<string>(stringToken)).toBe('hello world 1')
    expect(container.get<string>(stringToken)).toBe('hello world 1')
    expect(container.get<string>(stringToken)).toBe('hello world 1')
  })

  test('should use cached data in singleton scope', () => {
    const spy = mock()
    spy.mockReturnValue('test')

    container.bind<string>(exampleSymbol, spy)

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

    container
      .bind<IExampleConstructable>(exampleSymbol, () =>  new class implements IExampleConstructable {
        count = 1
        hello() {
          return `world ${this.count++}`
        }
      })
    container.meta(exampleSymbol, { transient: true })

    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')

    container
      .bind<IExampleConstructable>(stringToken, () =>  new class implements IExampleConstructable {
        count = 1
        hello() {
          return `world ${this.count++}`
        }
      })
    container.meta(stringToken, { transient: true })

    expect(container.get<IExampleConstructable>(stringToken).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(stringToken).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(stringToken).hello()).toBe('world 1')
  })

  test('can bind a constructable in singleton scope', () => {
    interface IExampleConstructable {
      hello(): string
    }

    container
      .bind<IExampleConstructable>(exampleSymbol, () => new class implements IExampleConstructable {
          count = 1
          hello() {
            return `world ${this.count++}`
          }
        },
      )

    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 1')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 2')
    expect(container.get<IExampleConstructable>(exampleSymbol).hello()).toBe('world 3')
  })

  test('can bind a constant value', () => {
    container.bind<string>(exampleSymbol, () => 'constant world')
    expect(container.get<string>(exampleSymbol)).toBe('constant world')

    container.bind(stringToken, () => 'constant world')
    expect(container.get<string>(stringToken)).toBe('constant world')
  })

  test('can bind a constant value of zero', () => {
    container.bind<number>(exampleSymbol, () => 0)
    expect(container.get<number>(exampleSymbol)).toBe(0)

    container.bind(stringToken, () => 0)
    expect(container.get<number>(stringToken)).toBe(0)
  })

  test('can bind a negative constant value', () => {
    container.bind<number>(exampleSymbol, () => -10)
    expect(container.get<number>(exampleSymbol)).toBe(-10)
  })

  test('can bind a function value', () => {
    container.bind<(str: string) => string>(exampleSymbol, () => (str: string) => `hello ${str}`)
    expect(container.get<(str: string) => string>(exampleSymbol)('world')).toBe('hello world')
  })

  test('can bind a constructable value', () => {
    class HelloWorld {}
    container.bind(exampleSymbol, () => HelloWorld)
    expect(new (container.get<ObjectConstructor>(exampleSymbol))()).toBeInstanceOf(HelloWorld)
  })

  test('can bind a constant value of empty string', () => {
    container.bind<string>(exampleSymbol, () => '')
    expect(container.get<string>(exampleSymbol)).toBe('')
  })

  test('can not bind to a symbol more than once', () => {
    container.bind(exampleSymbol, () => null)
    expect(() => container.bind(exampleSymbol, () => null)).toThrow('object can only bound once: Symbol(example)')
  })

  test('can not bind to a token more than once', () => {
    container.bind(stringToken, () => null)
    expect(() => container.bind(stringToken, () => null)).toThrow('object can only bound once: exampleStr')
  })

  test('can rebind to a symbol', () => {
    container.bind(exampleSymbol, () =>'hello world')
    expect(container.get<string>(exampleSymbol)).toBe('hello world')

    container.rebind(exampleSymbol, () => 'good bye world')
    expect(container.get<string>(exampleSymbol)).toBe('good bye world')
  })

  test('can remove a symbol', () => {
    container.bind<string>(exampleSymbol, () => 'hello world')
    expect(container.get<string>(exampleSymbol)).toBe('hello world')
  })

  test('can snapshot and restore the registry', () => {
    container.bind<string>(exampleSymbol, () => 'hello world')
    expect(container.get<string>(exampleSymbol)).toBe('hello world')

    container.snapshot()
    container.rebind<string>(exampleSymbol, () => 'after first snapshot')
    expect(container.get<string>(exampleSymbol)).toBe('after first snapshot')

    container.snapshot()
    container.rebind<string>(exampleSymbol, () => 'after second snapshot')
    expect(container.get<string>(exampleSymbol)).toBe('after second snapshot')

    container.snapshot()
    container.rebind<string>(exampleSymbol, () => 'after fourth snapshot')
    expect(container.get<string>(exampleSymbol)).toBe('after fourth snapshot')

    container.restore()
    expect(container.get<string>(exampleSymbol)).toBe('after second snapshot')

    container.restore()
    expect(container.get<string>(exampleSymbol)).toBe('after first snapshot')

    container.restore()
    expect(container.get<string>(exampleSymbol)).toBe('hello world')

    container.restore()
    expect(container.get<string>(exampleSymbol)).toBe('hello world')
  })
})
