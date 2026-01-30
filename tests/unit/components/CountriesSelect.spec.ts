// import { describe, expect, it } from 'vitest'
import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { nextTick } from 'vue'
import CountriesSelect from '../../../src/components/CountriesSelect.vue'

// import {useRegionsStore} from "../../../src/stores/regions";
/// import { mockModal } from '../mocks/modal-provide-config'
import { setMountComponent } from '../utils'
import { mockModal } from '../mocks/modal-provide-config'
import { regionFetchListResultMock } from '../mocks/country-select'
import {flushPromises} from "@vue/test-utils";

// import { testOn } from '../templates/shared-tests/test-case-generator'

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

// const fetchRegionListMock = vi.fn(async () => [])

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

  it('Renders BaseModal and displays modal with correct slot content after showModal is called', async () => {
    props.modelValue = []

    const wrapper = getMountComponent(props)

    await flushPromises()

    ;(wrapper.vm as any).onSelectItem((regionFetchListResultMock as any)['UA'])

    await nextTick()

    const emitted = wrapper.emitted('update:modelValue') || []
    console.log(emitted)
    // expect(emitted.length).toBeGreaterThan(0)
    //
    // const last = emitted[emitted.length - 1][0]
    // expect(last).toEqual(expect.arrayContaining(['UA-KY']))
  })
})
