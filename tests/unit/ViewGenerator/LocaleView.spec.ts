import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleView from '../../../src/components/templates/ViewGenerator/_components/LocaleView.vue'

const allLocalesKeys = {
  en: 'English',
  fr: 'French',
}

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

    const wrapper = mount(LocaleView, {
      props: {
        item: mockItem,
      },
    })

    expect(wrapper.text()).toBe(allLocalesKeys.en)
  })
  it('Not render any value with not correct key or empty item ', () => {
    const mockItem = {
      value: '',
    }

    const wrapper = mount(LocaleView, {
      props: {
        item: mockItem,
      },
    })

    expect(wrapper.text()).toBe(mockItem.value)
  })
})
