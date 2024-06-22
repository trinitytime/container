import { Container, NOCACHE, NOPLUGINS, createDecorator, createResolve, createWire, token } from './'
import { Container as ContainerOriginal } from './container'
import { createDecorator as createDecoratorOriginal } from './createDecorator'
import { createResolve as createResolveOriginal } from './createResolve'
import { createWire as createWireOriginal } from './createWire'
import { NOCACHE as NOCACHEOriginal, NOPLUGINS as NOPLUGINSOriginal } from './tags'
import { token as tokenOriginal } from './token'

describe('Module', () => {
  test('should export "Container" class', () => {
    expect(Container).toBe(ContainerOriginal)
  })

  test('should export "token" function', () => {
    expect(token).toBe(tokenOriginal)
  })

  test('should export "createDecorator" function', () => {
    expect(createDecorator).toBe(createDecoratorOriginal)
  })

  test('should export "createResolve" function', () => {
    expect(createResolve).toBe(createResolveOriginal)
  })

  test('should export "createWire" function', () => {
    expect(createWire).toBe(createWireOriginal)
  })

  test('should export "NOCACHE" symbol/tag', () => {
    expect(NOCACHE).toBe(NOCACHEOriginal)
  })

  test('should export "NOPLUGINS" symbol/tag', () => {
    expect(NOPLUGINS).toBe(NOPLUGINSOriginal)
  })
})
