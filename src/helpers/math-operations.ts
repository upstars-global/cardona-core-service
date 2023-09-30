import { Decimal } from 'decimal.js'

export function multiplication(a, b) {
  if (isNaN(+a) || isNaN(+b))
    return a

  const _a = new Decimal(+a)
  const _b = new Decimal(+b)

  return _a.mul(_b).toNumber()
}

export function division(a, b) {
  if (isNaN(+a) || isNaN(+b))
    return a

  const _a = new Decimal(+a)
  const _b = new Decimal(+b)

  return _a.div(_b).toNumber()
}
