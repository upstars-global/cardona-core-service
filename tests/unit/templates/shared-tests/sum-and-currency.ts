import { expect } from 'vitest'
import { getCurrency } from '../../../../src/directives/currency'
import { t } from './locales'

export interface SumAndCurrencyParams {
  key: string
  label: string
  value: number
}

export const checkLabelAndValue = (
  currentElement: (key: string) => unknown,
  { key, label, value }: SumAndCurrencyParams,
) => {
  expect(currentElement(label).text()).toBe(t(`component.sumPeriod.${key}`).trim())

  expect(currentElement(`data-${key}`).text()).toBe(getCurrency(value))
}
