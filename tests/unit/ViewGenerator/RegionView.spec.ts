import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegionView from '../../../src/components/templates/ViewGenerator/_components/RegionView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const getMountRegionView = setMountComponent(RegionView)

const mockStore = {
  getters: {
    'regions/countryList': {
      list: [
        { id: 'US', name: 'United States' },
        { id: 'FR', name: 'France' },
        { id: 'UA', name: 'Ukraine' },
      ],
    },
  },
  dispatch: vi.fn(),
}

const mockItem = {
  value: 'US',
}

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => mockStore, // Мокаем useStore
  }
})

describe('RegionView.vue', () => {
  beforeEach(() => {
    mockStore.dispatch.mockClear()
  })

  it('Renders the correct region based on item value', async () => {
    const wrapper = getMountRegionView({ item: mockItem })

    testOn.equalTextValue({ wrapper }, 'United States')
  })

  it('Calls fetchCountriesList when countryList is empty', async () => {
    mockStore.getters['regions/countryList'].list = []

    const wrapper = getMountRegionView({ item: mockItem })

    await wrapper.vm.$nextTick()

    expect(mockStore.dispatch).toHaveBeenCalledWith('regions/fetchCountriesList')
  })
})
