import type { Container } from './container.ts'
import { NOCACHE } from './tags.ts'
import type { Token } from './types.ts'
import { valueOrArrayToArray } from './utils.ts'

export function define<Dep, Target extends { [key in Prop]: Dep }, Prop extends keyof Target>(
  target: Target,
  property: Prop,
  container: Container,
  token: Token<Dep>,
  tags: symbol[] | symbol,
) {
  Object.defineProperty(target, property, {
    get: function <R>(this: R): Dep {
      const value = container.get(token, tags, this)
      if (valueOrArrayToArray(tags).indexOf(NOCACHE) === -1)
        Object.defineProperty(this, property, {
          value,
          enumerable: true,
        })
      return value
    },
    configurable: true,
    enumerable: true,
  })
}
