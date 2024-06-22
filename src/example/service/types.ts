import { token } from '../../token'
import type { MyOtherService } from './my-other-service'

export const TYPE = {
  MyService: Symbol('MyService'),
  MyOtherService: token<MyOtherService>('MyOtherService'),
}
