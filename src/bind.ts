import { Options } from './options.ts'
import type { Factory, NewAble, RegItem, Value } from './types.ts'

export class Bind<Dep> {
  constructor(private _regItem: RegItem<Dep>) {}

  to<Obj extends NewAble<Dep>>(object: Obj): Options<Dep> {
    this._regItem.factory = (): Dep => new object()
    return new Options<Dep>(this._regItem)
  }

  toFactory(factory: Factory<Dep>): Options<Dep> {
    this._regItem.factory = factory
    return new Options<Dep>(this._regItem)
  }

  toValue(value: Value<Dep>): Options<Dep> {
    if (undefined === value) throw new Error('cannot bind a value of type undefined')
    this._regItem.value = value
    return new Options<Dep>(this._regItem)
  }
}
