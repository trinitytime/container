import type { Container } from './container.ts'

export type Factory<Dep> = () => Dep
export type Value<Dependency> = Dependency

export interface RegItem<Dep = unknown> {
  value?: Value<Dep>
  factory?: Factory<Dep>
  cache?: Dep
  transient?: boolean
  singleton?: boolean
  plugins?: Plugin<Dep>[]
}

export type Plugin<Dep = unknown> = (
  dependency: Dep,
  target: unknown,
  tags: symbol[],
  token: MaybeToken<Dep>,
  container: Container,
) => void

export interface NewAble<Dep> {
  new (): Dep
}

// tokens
declare const dependencyMarker: unique symbol
declare const argumentsMarker: unique symbol
export interface Token<Dep> {
  type: symbol
  [dependencyMarker]: Dep
}

export type MaybeToken<Dep = unknown> = Token<Dep> | symbol
