import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import CountriesSelect from '../../../src/components/CountriesSelect.vue'

import { setMountComponent } from '../utils'
import { mockModal } from '../mocks/modal-provide-config'
import { regionFetchListResultMock } from '../mocks/country-select'

export const modalSpy = vi.spyOn(mockModal, 'showModal')

export const global = {
  provide: { modal: mockModal },
}

const getMountComponent = props => setMountComponent(CountriesSelect)(props, global)

const defaultProps = {
  modelValue: [],
  disabled: false,
  allowedOnly: false,
  bannedOnly: [],
  excludeCountries: [],
  customLabel: '',
  customDescription: '',
  required: false,
}

let props

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
})
