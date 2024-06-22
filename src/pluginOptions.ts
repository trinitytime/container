import type { Plugin, RegItem } from './types'

export class PluginOptions<Dep> {
  constructor(protected _regItem: RegItem<Dep>) {}

  withPlugin(plugin: Plugin<Dep>): PluginOptions<Dep> {
    this._regItem.plugins ??= []
    this._regItem.plugins.push(plugin)
    return this
  }
}
