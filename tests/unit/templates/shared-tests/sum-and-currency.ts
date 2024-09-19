import type { VueWrapper } from '@vue/test-utils'
import { getCurrency } from '../../../../src/directives/currency'
import { t } from './locales'
import { testOn } from './test-case-generator'

export interface SumAndCurrencyParams {
  key: string
  label: string
  value: number
}

export const checkLabelAndValue = (
  wrapper: VueWrapper,
  { key, label, value }: SumAndCurrencyParams,
) => {
  testOn.equalTextValue({ wrapper, testId: label }, t(`component.sumPeriod.${key}`).trim())
  testOn.equalTextValue({ wrapper, testId: `data-${key}` }, getCurrency(value))
}
