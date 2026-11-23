import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useNumberMaxValue } from '../../../src/composables/useNumberMaxValue'
import type { NumberOrString } from '../../../src/@model'

const setup = (max: unknown, initial: NumberOrString = '') => {
  const maxValue = ref(max)
  const modelValue = ref<NumberOrString>(initial)
  const onExceeded = vi.fn()
  const { isLimitExceeded } = useNumberMaxValue(() => maxValue.value, () => modelValue.value, onExceeded)

  return { maxValue, modelValue, onExceeded, isLimitExceeded }
}

describe('useNumberMaxValue', () => {
  describe('isLimitExceeded', () => {
    it('accepts everything when max_value is not set', () => {
      [undefined, null, ''].forEach(max => {
        const { isLimitExceeded } = setup(max, '1')

        expect(isLimitExceeded('99999999999999999999')).toBe(false)
      })
    })

    it('rejects a value greater than max_value', () => {
      const { isLimitExceeded } = setup(100, '10')

      expect(isLimitExceeded('100')).toBe(false)
      expect(isLimitExceeded('101')).toBe(true)
    })

    it('rejects a value that is longer than max_value by integer digits', () => {
      const { isLimitExceeded } = setup(999_999, '12345')

      expect(isLimitExceeded('123456')).toBe(false)
      expect(isLimitExceeded('1234567')).toBe(true)
    })

    it('ignores the sign and the fractional part when counting digits', () => {
      const { isLimitExceeded } = setup(999_999, '12345')

      expect(isLimitExceeded('-123456')).toBe(false)
      expect(isLimitExceeded('123456.789')).toBe(false)
      expect(isLimitExceeded('123456,789')).toBe(false)
      expect(isLimitExceeded('1234567.5')).toBe(true)
    })

    it('accepts a string max_value', () => {
      const { isLimitExceeded } = setup('100', '10')

      expect(isLimitExceeded('101')).toBe(true)
      expect(isLimitExceeded('100')).toBe(false)
    })

    it('lets a model value that is already over the limit only decrease', () => {
      const { isLimitExceeded } = setup(100, 150)

      expect(isLimitExceeded('149')).toBe(false)
      expect(isLimitExceeded('150')).toBe(true)
      expect(isLimitExceeded('151')).toBe(true)
    })

    it('lets a model value that is longer than the limit be shortened', () => {
      const { isLimitExceeded } = setup(999_999, 12_345_678)

      expect(isLimitExceeded('1234567')).toBe(false)
      expect(isLimitExceeded('123456789')).toBe(true)
    })

    it('follows the current model value and max_value', async () => {
      const { isLimitExceeded, modelValue, maxValue } = setup(100, '10')

      expect(isLimitExceeded('101')).toBe(true)

      maxValue.value = 200
      expect(isLimitExceeded('101')).toBe(false)

      modelValue.value = 300
      expect(isLimitExceeded('250')).toBe(false)
      expect(isLimitExceeded('301')).toBe(true)
    })
  })

  describe('onExceeded', () => {
    it('is called on setup when the initial value is over max_value', () => {
      const { onExceeded } = setup(100, 150)

      expect(onExceeded).toHaveBeenCalledTimes(1)
    })

    it('is not called for a value within max_value, an empty value or a missing max_value', () => {
      expect(setup(100, 100).onExceeded).not.toHaveBeenCalled()
      expect(setup(100, '').onExceeded).not.toHaveBeenCalled()
      expect(setup(undefined, 999).onExceeded).not.toHaveBeenCalled()
    })

    it('is called when the model value becomes over max_value', async () => {
      const { onExceeded, modelValue } = setup(100, 10)

      modelValue.value = 500
      await nextTick()

      expect(onExceeded).toHaveBeenCalledTimes(1)
    })

    it('is called when max_value is lowered under the model value', async () => {
      const { onExceeded, maxValue } = setup(100, 50)

      maxValue.value = 10
      await nextTick()

      expect(onExceeded).toHaveBeenCalledTimes(1)
    })

    it('is not called when the value changes but stays within max_value', async () => {
      const { onExceeded, modelValue } = setup(100, 10)

      modelValue.value = 20
      await nextTick()

      expect(onExceeded).not.toHaveBeenCalled()
    })
  })
})
