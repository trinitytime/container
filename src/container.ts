import { Bind } from './bind.ts'
import type { Plugin, RegItem, Token } from './types.ts'

type Registry = Map<symbol, RegItem>

function getItemValue<Dep>(item: RegItem<Dep> | undefined): Dep | undefined {
  if (undefined === item) return undefined
  if (!item.factory) return item.value
  if (item.transient) return item.factory()
  if (!item.value) {
    item.value = item.factory()
  }

  return item.value
}

export class Container {
  private _registry: Registry = new Map<symbol, RegItem>()
  private _snapshots: Registry[] = []
  private _plugins: Plugin[] = []

  bind<Dep = never>(token: Token<Dep>): Bind<Dep> {
    if (this._registry.get(token.type)) throw new Error(`object can only bound once: ${token.type.toString()}`)

    const item = {}

    this._registry.set(token.type, item)

    return new Bind<Dep>(item as RegItem<Dep>)
  }

  rebind<Dep = never>(token: Token<Dep>): Bind<Dep> {
    return this.remove(token).bind<Dep>(token)
  }

  remove(token: Token<unknown>): Container {
    if (undefined === this._registry.get(token.type)) throw new Error(`${token.type.toString()} was never bound`)

    this._registry.delete(token.type)

    return this
  }

  get<Dep>(token: Token<Dep>, tags?: symbol[] | symbol, target?: unknown): Dep
  get<Dep>(token: Token<Dep>, tags: symbol[] | symbol, target: unknown): Dep
  get<Dep>(token: Token<Dep>, tags: symbol[] | symbol = [], target?: unknown): Dep {
    const item = <RegItem<Dep> | undefined>this._registry.get(token.type)

    const value = getItemValue<Dep>(item)

    if (undefined === value) throw new Error(`nothing bound to ${token.type.toString()}`)

    return value

    // if (!item || (!item.factory && undefined === item.value))
    //   throw new Error(`nothing bound to ${token.type.toString()}`)

    // const value: Dep = item.factory
    //   ? !item.singleton
    //     ? item.factory()
    //     : (item.cache = item.cache || item.factory())
    //   : item.value! // eslint-disable-line

    // const tagsArr = valueOrArrayToArray(tags)

    // if (tagsArr.indexOf(NOPLUGINS) === -1) {
    //   for (const plugin of item.plugins.concat(this._plugins)) {
    //     plugin(value, target, tagsArr, token, this)
    //   }
    // }

    // return value
  }

  addPlugin(plugin: Plugin): Container {
    this._plugins.push(plugin)
    return this
  }

  snapshot(): Container {
    this._snapshots.push(new Map(this._registry))
    return this
  }

  restore(): Container {
    this._registry = this._snapshots.pop() || this._registry
    return this
  }
}
