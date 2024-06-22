import type { MaybeToken, Token } from './types.ts'
import { isSymbol } from './utils.ts'

export const token = <Dep>(name: string) => ({ type: Symbol(name) }) as Token<Dep>

export const stringifyToken = (token: MaybeToken): string =>
  !isSymbol(token) ? `Token(${token.type.toString()})` : token.toString()

export const getType = (token: MaybeToken): symbol => (!isSymbol(token) ? token.type : token)
