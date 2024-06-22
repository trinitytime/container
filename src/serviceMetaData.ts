import type { Factory } from "./types.ts"

export class ServiceMetaData<T> {

  factory: Factory<T>
  value?: T
  transient?: boolean

  constructor(factory: Factory<T>) {
    this.factory = factory
  }

  getValue(): T { 
    if (this.transient) return this.factory() as T

    if (undefined === this.value) {
      this.value = this.factory()
    }

    return this.value
  }

}