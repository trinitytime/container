import type { Container } from './container.ts'
import { define } from './define.ts'
import type { Token } from './types.ts'

export function createDecorator(container: Container) {
  return <Dep>(token: Token<Dep>, tags: symbol[] | symbol = []) => {
    return <Target extends { [key in Prop]: Dep }, Prop extends keyof Target>(target: Target, property: Prop): void => {
      define(target, property, container, token, tags)
    }
  }
}
