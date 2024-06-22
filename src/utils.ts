export const isSymbol = (value: any): value is symbol => {
  return !!value && value.constructor === Symbol
}

export const valueOrArrayToArray = (smt: symbol[] | symbol): symbol[] => (isSymbol(smt) ? [smt] : smt)
