import { describe, it, vi } from 'vitest'
import LocaleView from '../../../src/components/templates/ViewGenerator/_components/LocaleView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const allLocalesKeys = {
  en: 'English',
  fr: 'French',
}

const getMountLocaleView = setMountComponent(LocaleView)

vi.mock('../../../src/store', () => ({
  default: {
    getters: {
      'localeCore/allLocalesKeys': {
        en: 'English',
        fr: 'French',
      },
    },
  },
}))

describe('LocaleView.vue', () => {
  it('Renders the correct locale based on item value', () => {
    const mockItem = {
      value: 'en',
    }

    const wrapper = getMountLocaleView({ item: mockItem })

    testOn.existTextValue({ wrapper }, allLocalesKeys.en)
  })
  it('Not render any value with not correct key or empty item ', () => {
    const mockItem = {
      value: '',
    }

    const wrapper = getMountLocaleView({ item: mockItem })

    testOn.existTextValue({ wrapper }, '')
  })
})
