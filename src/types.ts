type Constructable<T> = new (...args: any[]) => T;
type AbstractConstructable<T> = NewableFunction & { prototype: T };

export type ServiceIdentifier<T = unknown> =
  | Constructable<T>
  | AbstractConstructable<T>
  | CallableFunction
  | symbol
  | string



export type Factory<T> = () => T



