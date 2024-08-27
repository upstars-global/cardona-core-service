import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import AppLogo from '../AppLogo.vue'

const TEXT_IN_COMPONENT = 'BackOffice'

describe('AppLogo.vue - default test run unit test', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(AppLogo)

    expect(wrapper.html()).toContain(`<h3 class="text-primary text-uppercase">${TEXT_IN_COMPONENT}</h3>`)
  })

  it('renders the correct text', () => {
    const wrapper = mount(AppLogo)
    const h3 = wrapper.find('h3')

    expect(h3.text()).toBe(TEXT_IN_COMPONENT)
  })

  it('has the correct classes applied', () => {
    const wrapper = mount(AppLogo)
    const h3 = wrapper.find('h3')

    expect(h3.classes()).toContain('text-primary')
    expect(h3.classes()).toContain('text-uppercase')
  })
})
