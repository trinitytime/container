import { ServiceMetaData } from './serviceMetaData.js'
import type { Factory, ServiceIdentifier } from './types.ts'

type Registry = Map<ServiceIdentifier, ServiceMetaData<unknown>>

export interface MetaDataOptions {
  transient: boolean
}

export class Container {

  private serviceMap = new Map<ServiceIdentifier, ServiceMetaData<unknown>>()
  private snapshots: Registry[] = []

  bind<T = unknown>(identifier: ServiceIdentifier<T>, factory: Factory<T>): Container {

    if (this.serviceMap.get(identifier)) throw new Error(`object can only bound once: ${identifier.toString()}`)

    this.serviceMap.set(identifier, new ServiceMetaData(factory))

    return this
  }

  remove(identifier: ServiceIdentifier): Container {
    this.serviceMap.delete(identifier)

    return this
  }

  rebind<T = unknown>(identifier: ServiceIdentifier<T>, factory: Factory<T>): Container {
    return this.remove(identifier).bind(identifier, factory)
  }


  get<T = unknown>(identifier: ServiceIdentifier<T>): T {
    const metaData: ServiceMetaData<T> = this.serviceMap.get(identifier) as ServiceMetaData<T>

    if (!metaData) throw new Error(`nothing bound to ${identifier.toString()}`)

    return metaData.getValue()
  }

  meta(identifier: ServiceIdentifier, options: Partial<MetaDataOptions>): Container {
    const metaData = this.serviceMap.get(identifier)
    if (metaData) {
      if (undefined !== options.transient) metaData.transient = options.transient
    }

    return this
  }

  snapshot(): Container {
    this.snapshots.push(new Map(this.serviceMap))
    return this
  }

  restore(): Container {
    this.serviceMap = this.snapshots.pop() || this.serviceMap
    return this
  }
}
