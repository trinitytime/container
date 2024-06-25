type Constructable<T> = new (...args: any[]) => T
type AbstractConstructable<T> = NewableFunction & { prototype: T }

export interface IToken<T> {
  type: symbol
  value: T
  toString(): string
}

export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | IToken<T>
  | CallableFunction
  | symbol
  | string

export type Factory<T> = () => T
