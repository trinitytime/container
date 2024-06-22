import type { RegItem } from './types.ts'

export class Options<Dep> {
  constructor(protected _regItem: RegItem<Dep>) {}

  transient(): Options<Dep> {
    this._regItem.transient = true
    return this
  }

  inSingletonScope(): Options<Dep> {
    this._regItem.singleton = true
    return this
  }
}
