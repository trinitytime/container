import type { IToken } from './types.ts'

class Token<T> implements IToken<T> {
  type: symbol
  value: T = undefined as T

  constructor(name: string) {
    this.type = Symbol(name)
  }

  toString() {
    return this.type.toString()
  }
}

export const token = <T>(name: string) => new Token(name) as IToken<T>
