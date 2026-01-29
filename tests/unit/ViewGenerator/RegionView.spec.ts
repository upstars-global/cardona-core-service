import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegionView from '../../../src/components/templates/ViewGenerator/_components/RegionView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const fetchCountriesList = vi.fn()

let countryList = []

vi.mock('../../../src/stores/regions', () => ({
  useRegionsStore: () => ({
    countryList: {
      list: countryList,
    },
    fetchCountriesList,
  }),
}))

const getMountRegionView = setMountComponent(RegionView)

const mockItem = {
  value: 'US',
}

describe('RegionView.vue', () => {
  beforeEach(() => {
    vi.resetModules()
    fetchCountriesList.mockClear()
  })

  it('Renders the correct region based on item value', async () => {
    countryList = [
      { id: 'US', name: 'United States' },
      { id: 'FR', name: 'France' },
      { id: 'UA', name: 'Ukraine' },
    ]

    const wrapper = getMountRegionView({ item: mockItem })

    testOn.equalTextValue({ wrapper }, 'United States')
  })

  it('Calls fetchCountriesList when countryList is empty', async () => {
    countryList = []

    const wrapper = getMountRegionView({ item: mockItem })

    await wrapper.vm.$nextTick()

    expect(fetchCountriesList).toHaveBeenCalled()
  })
})
