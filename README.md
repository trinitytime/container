# @trinity/container

This library implements dependency injection for javascript and typescript.

## Features

* Does not use decorators.
* Designed to minimize functionality and be **simple** to use
* **Cached** - Creates and caches once by default.
* **Cache can be turned off directly**
* **Built with unit testing** in mind
* Support for dependency **rebinding** and container **snapshot** and **restore**
* **Lightweight** - Only 1.5kb without compression.
* Reflection metadata, which is approximately 50kb in size, **is not needed**.
* 100% written in **Typescript**.

## Install

```bash
npm install @trinity/container
```

## The Container API

### Creating a container

A container is where all dependencies are bound. A project can use multiple containers.

```ts
import { Container } from '@trinity/container'

const container = new Container();
```

### Binding

#### Bind key
Keys used for binding can be classes, functions, symbols, or strings.


```ts
const ServiceKey = () => new Service()
const ServiceToken = token('ServiceToken')

container.bind<ServiceInterface>(Service, () => new Service())
container.bind<ServiceInterface>(ServiceKey, () => new Service())
container.bind<ServiceInterface>(Symbol.for('Service'), () => new Service())
container.bind<ServiceInterface>('Service', () => new Service())
container.bind<ServiceInterface>(ServiceToken, () => new Service())
```

#### Binding a class

Bindings are based on factory functions that return a value.
All dependencies are made within factory functions.


```ts
container.bind<ServiceInterface>(Service, () => new Service())
```

#### Binding a value

```ts
container.bind<ServiceInterface>(Service, () => 'just a string')
```

### Rebinding

This is the way how we can rebind a dependency while **unit tests**. We should not need to rebind in production code.

```ts
container.rebind<ServiceMock>(symbol, () => new ServiceMock())
```

### Removing

Normally this function is not used in production code. This will remove the dependency from the container. 

```ts
container.remove(symbol)
```


### Transient mode

If you need to create it every time rather than as a singleton, you can specify meta data.

```ts
container.bind<ServiceInterface>(Service, () => new Service())
container.meta(Service, { transient: true })
```

### Getting a value

```ts
const ServiceKey = () => new Service()

container.get(Service)
container.get<ServiceInterface>(ServiceKey)
container.get<ServiceInterface>(Symbol.for('Service'))
container.get<ServiceInterface>('Service')
```


### Dependency handling

Dependencies are created explicitly.


```ts
// service.ts
class Service {

}

container.bind(Service, () => new Service())

// module.ts
class Module {
  constructor(private service: Service) {}
}

container.bind(Module, () => new Module(
  container.get(Service)
))

// main.ts
const module = container.get(Module)
```

### Snapshot & Restore

This creates a snapshot of the bound dependencies. After this we can rebind dependencies and can restore it back to its old state after we made some **unit tests**.

```ts
container.snapshot();
```

```ts
container.restore();
```


## Getting Started

#### Step 1 - Installing the container library

```bash
npm install @trinitytime/container
``` 

#### Step 2 - Create container

File **app-container.ts**
```ts
const container = new Container()
```

#### Step 3 - Example services
File ***services/my-service.ts***
```ts
import { container } from '../app-container.ts'

export interface MyServiceInterface {
    hello: string;
}

export class MyService implements MyServiceInterface {
  hello = "world";
}

container.bind(MyService, () => new MyService())
```

File ***services/my-other-service.ts***
```ts
export interface MyOtherServiceInterface {
  random: number;
}

export class MyOtherService implements MyOtherServiceInterface {
  random = Math.random();

  constructor(private service: MyServiceInterface) {}
}

container.bind(MyOtherService, () => new MyOtherService(
  container.get<MyServiceInterface>(MyService)
))
```

#### Step 4 - Dependency Resolution

```ts
const app = container.get<MyOtherServiceInterface>(MyOtherService)
```


## Inspiration

- [@owja/ioc](https://github.com/owja/ioc)
- [InversifyJS](https://github.com/inversify/InversifyJS)
- [typeid](https://github.com/typestack/typedi)

## License

**MIT**
License under the MIT License (MIT)

Copyright © 2024 Trinitytime