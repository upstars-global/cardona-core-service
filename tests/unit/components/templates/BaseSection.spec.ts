import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import type { UseEntityType } from '../../../../src/components/templates/BaseSection/index.vue'
import BaseSection from '../../../../src/components/templates/BaseSection/index.vue'
import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import { PageType } from '../../../../src/@model/templates/baseSection'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { getSelectorTestId } from '../../utils'

const mockStore = createStore({
  getters: {
    isLoadingEndpoint: vi.fn(() => false),
    isErrorEndpoint: vi.fn(() => false),
  },
  actions: {
    readEntity: vi.fn(() =>
      Promise.resolve({
        id: '123',
        name: 'Test Entity',
      }),
    ),
  },
})

// Mock vue-router
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '123' },
      name: 'TestRoute',
    })),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
  }
})

const mountComponent = (props = {}, global = {}) =>
  mount(BaseSection, {
    props,
    global: {
      plugins: [mockStore],
      stubs: {
        VBtn: { template: '<button><slot /></button>' },
        VProgressCircular: { template: '<div class="progress"></div>' },
      },
      provide: { modal: mockModal },
      ...global,
    },
    slots: {
      default: `<template #default="{ form }">
                  <FieldGenerator v-model="form.isActive" />
                </template>`,
    },
  })

class MockForm {
  readonly id?: string
  readonly isActive: SwitchBaseField

  constructor(data: { id?: string; isActive: boolean }) {
    this.id = data?.id
    this.isActive = new SwitchBaseField({
      key: 'isActive',
      value: data?.isActive,
      label: i18n.t('userStatuses.active'),
    })
  }
}

const sectionConfig = new BaseSectionConfig({})

const useMockForm = (): UseEntityType<MockForm> => {
  const EntityFormClass = MockForm

  return {
    entityName: 'mock-form',
    EntityFormClass,
  }
}

describe('BaseSection.vue', () => {
  it('Renders correctly when form is present', async () => {
    const wrapper = mountComponent({
      pageType: PageType.Create,
      useEntity: useMockForm,
      config: sectionConfig,
      withReadAction: false,
    })

    await wrapper.vm.$nextTick()

    testOn.existElement({ wrapper, testId: 'base-section' })
  })

  it('Calls onSubmit with false when "Create and Exit" button is clicked', async () => {
    const onSubmitMock = vi.fn()

    const wrapper = mountComponent({
      pageType: PageType.Create,
      useEntity: useMockForm,
      config: sectionConfig,
      withReadAction: false,
    })

    wrapper.vm.onSubmit = onSubmitMock

    await wrapper.find(getSelectorTestId('create-button')).trigger('click')

    expect(onSubmitMock).toHaveBeenCalledWith(false)

    await wrapper.find(getSelectorTestId('stay-button')).trigger('click')
    expect(onSubmitMock).toHaveBeenCalledWith(true)
  })
})
