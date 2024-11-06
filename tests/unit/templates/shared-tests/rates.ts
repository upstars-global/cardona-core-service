import type { VueWrapper } from '@vue/test-utils'
import type { RatesValueItem } from '../../../../src/@model/templates/baseField/rates'
import { testOn } from './test-case-generator'

export const textOnEqualDataAndValueInput = (wrapper: VueWrapper, data: RatesValueItem[], callback?: (index: number) => void) => {
  data.forEach((value: RatesValueItem, index) => {
    const input = wrapper.findAll('input')[index]

    testOn.inputAttributeValueToBe({ wrapper: input }, value.value.toString())

    callback && callback(index)
  })
}
