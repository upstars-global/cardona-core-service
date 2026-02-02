import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import CountriesSelect from '../../../src/components/CountriesSelect.vue'

import { setMountComponent } from '../utils'
import { mockModal } from '../mocks/modal-provide-config'
import { regionFetchListResultMock } from '../mocks/country-select'
import { testOn } from '../templates/shared-tests/test-case-generator'

export const global = {
  provide: { modal: mockModal },
}

const getMountComponent = props => setMountComponent(CountriesSelect)(props, global)

const defaultProps = {
  modelValue: [],
  disabled: false,
  allowedOnly: false,
  bannedOnly: false,
  excludeCountries: [],
  customLabel: '',
  customDescription: '',
  required: false,
}

let props

const DATA_TEST_ID = {
  TOGGLE_MODE_COUNTRIES: 'toggle-mode-countries',
  COUNTRIES_SELECT_LABEL: 'countries-select-label',
  COUNTRIES_SELECT_DESCRIPTION: 'countries-select-description',
}

const getExpectedSelectedRegions = (countryOrRegion: string) => {
  const result = []

  for (const key in regionFetchListResultMock) {
    if (!countryOrRegion.includes('')) {
      if (countryOrRegion === key)
        result.push(key)
    }
    else {
      if (key.includes(countryOrRegion))
        result.push(key)
    }
  }

  return result
}

const fetchRegionListMock = vi.fn().mockResolvedValue(regionFetchListResultMock)

vi.mock('../../../src/stores/regions', () => {
  return {
    useRegionsStore: () => ({
      rows: [],
      loading: false,
      error: null,
      fetchRegionList: fetchRegionListMock,
    }),
  }
})

const testOnValidEmittedValue = async (value: string[]) => {
  const wrapper = getMountComponent(props)

  await flushPromises()

  ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

  await nextTick()

  const emitted = wrapper.emitted('update:modelValue') || []
  const emittedValue = emitted[0][0] as string[]

  const expectedValue = getExpectedSelectedRegions('UA')

  expect(emittedValue).toHaveLength(expectedValue.length)
  expect(emittedValue).toEqual(expect.arrayContaining(expectedValue))
}

describe('CountriesSelect.spec', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)

    if (!(Set.prototype as any).difference) {
      ;(Set.prototype as any).difference = function<T>(this: Set<T>, other: Set<T>) {
        const res: T[] = []
        for (const v of this) {
          if (!other.has(v))
            res.push(v)
        }

        return res
      }
    }
  })

  it('Expect selecting Ukraine country selects all its regions', async () => {
    await testOnValidEmittedValue(['UA'])
  })

  it('Expect selecting Poland-Mazovia region selects only this region', async () => {
    await testOnValidEmittedValue(['PL-MZ'])
  })

  it('Expect that not will render toggle mode', async () => {
    props.allowedOnly = true // or bannedOnly = true

    const wrapper = getMountComponent(props)

    await flushPromises()

    ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

    await nextTick()

    testOn.notExistElement({ wrapper, testId: 'toggle-mode-countries' })
  })

  it('Expect render required field label', async () => {
    props.required = true

    const wrapper = getMountComponent(props)

    await flushPromises()

    ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

    await nextTick()

    testOn.existClass({ wrapper, testId: DATA_TEST_ID.COUNTRIES_SELECT_LABEL }, 'required')

    /// Check that removing required works fine
    props.required = false
    await wrapper.setProps(props)
    testOn.notExistClasses({ wrapper, testId: DATA_TEST_ID.COUNTRIES_SELECT_LABEL }, 'required')
  })

  it('Expect redner custom label, and description', async () => {
    props = {
      ...props,
      customLabel: 'Custom Label',
      customDescription: 'Custom Description',
    }

    const wrapper = getMountComponent(props)

    await flushPromises()

    ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

    await nextTick()

    testOn.existTextValue({ wrapper, testId: DATA_TEST_ID.COUNTRIES_SELECT_LABEL }, props.customLabel)
    testOn.existTextValue({ wrapper, testId: DATA_TEST_ID.COUNTRIES_SELECT_DESCRIPTION }, props.customDescription)
  })

  it('Expect that options data will be filtered', async () => {
    const EXCLUDED_COUNTRIES = ['FR', 'FR-PAC', 'UA', 'UA-KY', 'UA-LV', 'UA-OD', 'UA-DP', 'UA-KH', 'UA-ZP', 'UA-VN']

    props.excludeCountries = EXCLUDED_COUNTRIES

    const wrapper = getMountComponent(props)

    await flushPromises()

    ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

    await nextTick()

    const regionsOptions = (wrapper.vm as any).regionsOptions as Array<{ code: string }>

    const codes = regionsOptions.map(item => item.code)

    expect(codes.some(code => EXCLUDED_COUNTRIES.includes(code))).toBe(false)

    expect(new Set(codes).size).toBe(codes.length)
  })
})
