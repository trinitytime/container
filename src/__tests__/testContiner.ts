import { Container } from "../container"

const container = new Container();


container.bind('foo', () => 'bar')

const foo2 = Symbol('foo2')
container.bind(foo2, () => 'bar')


class Foo4 {
  constructor() {
    console.log('Foo4 constructor')
  }
}
const createBar = () => 'bar'

container.bind(Foo4, () => new Foo4())

class Foo5 extends Foo4 {}
container.bind(Foo5, () => 'bar')

container.snapshot()
container.meta(Foo4, { transient: true })
container.restore()



console.log(container.get('foo')) // bar
console.log(container.get(foo2)) // bar
console.log(container.get(Foo4)) // bar
console.log(container.get(Foo4)) // bar
console.log(container.get(Foo5)) // bar
