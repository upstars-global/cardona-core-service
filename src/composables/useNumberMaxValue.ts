import { computed, watch } from 'vue'
import type { NumberOrString } from '../@model'

const DECIMAL_SEPARATOR_REGEXP = /[.,]/

// Sign and fractional part do not count: `max_value` limits only the integer digits
const getIntegerPartLength = (value: NumberOrString = ''): number =>
  value.toString().replace('-', '').split(DECIMAL_SEPARATOR_REGEXP)[0].length

const isEmptyRule = (value: unknown): boolean => value === undefined || value === null || value === ''

/**
 * Everything NumberField does about the `max_value` validation rule.
 *
 * - `isLimitExceeded(next)` — blocks input that goes over the limit (by integer length or by value).
 *   A value that is already over the limit (came from props) may only be decreased, never increased.
 * - `onExceeded` — called whenever the current value is over `max_value`. vee-validate does not validate a value
 *   that arrived through props, so the owner uses it to ask FieldGenerator for validation.
 */
export const useNumberMaxValue = (
  getMaxValue: () => unknown,
  getModelValue: () => NumberOrString,
  onExceeded: () => void,
) => {
  const maxIntegerLength = computed(() => {
    const max = getMaxValue()

    return isEmptyRule(max) ? 0 : getIntegerPartLength(max as NumberOrString)
  })

  const maxValue = computed(() => {
    const max = getMaxValue()

    return isEmptyRule(max) ? Number.NaN : Number(max)
  })

  // The cursor position is unknown in type="number", so the limit is checked on the resulting value
  // (typing, paste, drop, replacing a selection) rather than on the pressed key.
  const isLengthExceeded = (nextValue: NumberOrString): boolean => {
    const nextLength = getIntegerPartLength(nextValue)

    return !!maxIntegerLength.value
      && nextLength > maxIntegerLength.value
      && nextLength >= getIntegerPartLength(getModelValue())
  }

  const isValueExceeded = (nextValue: NumberOrString): boolean =>
    !Number.isNaN(maxValue.value)
    && Number(nextValue) > maxValue.value
    && Number(nextValue) >= Number(getModelValue())

  const isLimitExceeded = (nextValue: NumberOrString): boolean =>
    isLengthExceeded(nextValue) || isValueExceeded(nextValue)

  const isMaxValueExceeded = (value: NumberOrString): boolean =>
    value !== '' && !Number.isNaN(maxValue.value) && Number(value) > maxValue.value

  watch(
    () => [getModelValue(), maxValue.value],
    () => {
      if (isMaxValueExceeded(getModelValue()))
        onExceeded()
    },
    { immediate: true },
  )

  return { isLimitExceeded }
}
