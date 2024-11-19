import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { UseEntityType } from '../../../../src/components/templates/BaseSection/index.vue'
import BaseSection from '../../../../src/components/templates/BaseSection/index.vue'
import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { PageType } from '../../../../src/@model/templates/baseSection'
import { getSelectorTestId } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { basePermissions } from '../../../../src/helpers/base-permissions'

vi.mock('path/to/generateEntityUrl', () => ({
  generateEntityUrl: vi.fn(() => '/mock-entity-url'),
}))

vi.mock('../../../../src/helpers/base-permissions', () => ({
  basePermissions: vi.fn(() => ({
    canCreateSeo: true,
    canUpdate: true,
    canUpdateSeo: false,
    canRemove: false,
    canViewSeo: true,
  })),
}))

global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

const mockStore = createStore({
  state: {
    errorUrls: [],
  },
  getters: {
    isLoadingEndpoint: () => vi.fn(() => false),
    isLoadingPage: vi.fn(() => false),
    abilityCan: () => true,
    isErrorEndpoint: () => vi.fn(() => false),
  },
  actions: {
    resetErrorUrls: vi.fn(),
  },
})

const goMock = vi.fn()
const pushMock = vi.fn()

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '123' },
      name: 'TestRoute',
      options: {
        history: {
          state: {
            back: true,
          },
        },
      },
    })),
    useRouter: vi.fn(() => ({
      push: pushMock,
      go: goMock,
      options: {
        history: {
          state: {
            back: true,
          },
        },
      },
    })),
  }
})

const mountComponent = (props = {}, global = {}, slots = {}) =>
  mount(BaseSection, {
    props,
    global: {
      plugins: [mockStore],
      stubs: {
        VBtn: { template: '<button><slot /></button>' },
      },
      provide: { modal: mockModal },
      ...global,
    },
    slots: {
      default: `<template #default="{ form }">
                  <FieldGenerator v-model="form.isActive" />
                </template>`,
      ...slots,
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
    loadingEndpointArr: ['/test-endpoint'],
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
    }, {
      plugins: [mockStore],
    })

    wrapper.vm.onSubmit = onSubmitMock

    testOn.notExistElement({ wrapper, testId: 'save-button' })

    const buttonCreate = wrapper.find(getSelectorTestId('create-button'))

    await buttonCreate.trigger('click')
    expect(onSubmitMock).toHaveBeenCalled()
  })

  it('Triggers remove modal on remove button click', async () => {
    const wrapper = mountComponent({
      pageType: PageType.Update,
      useEntity: useMockForm,
      config: sectionConfig,
    })

    const modalSpy = vi.spyOn(mockModal, 'showModal')

    await wrapper.vm.onClickRemove()

    expect(modalSpy).toHaveBeenCalledWith('form-item-remove-modal')
  })
  it('Validates form and handles errors correctly', async () => {
    const wrapper = mountComponent({
      pageType: PageType.Update,
      useEntity: useMockForm,
      config: sectionConfig,
    })

    const formRefMock = {
      validate: vi.fn(() => Promise.resolve({ valid: false })),
      getErrors: vi.fn(() => ({ isActive: { isNotEmpty: true } })),
    }

    wrapper.vm.formRef = formRefMock

    const validateResult = await wrapper.vm.validate()

    expect(validateResult).toBe(false)
    expect(formRefMock.validate).toHaveBeenCalled()
  })

  it('Shows loading state when isLoading is true', () => {
    const wrapper = mountComponent({
      pageType: PageType.Update,
      useEntity: useMockForm,
      config: sectionConfig,
      withReadAction: false,
    },
    {
      plugins: [createStore({
        state: {
          errorUrls: [],
        },
        getters: {
          isLoadingEndpoint: () => vi.fn(() => true),
          isLoadingPage: vi.fn(() => true),
          abilityCan: () => true,
          isErrorEndpoint: () => vi.fn(() => false),
        },
        actions: {
          resetErrorUrls: vi.fn(),
        },
      })],
    })

    expect(wrapper.exists()).toBe(true)

    expect(wrapper.find(getSelectorTestId('loading')).exists()).toBe(true)
    expect(wrapper.find('[data-test-id="save-button"]').attributes('disabled')).toBeDefined()
  })

  it('Calls onClickCancel when cancel button is clicked', async () => {
    const mockRouter = useRouter()

    const wrapper = mountComponent({
      pageType: PageType.Update,
      useEntity: useMockForm,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
      }),
      withReadAction: false,
    })

    const onClickCancelMock = vi.fn()

    wrapper.vm.onClickCancel = onClickCancelMock

    const cancelButton = wrapper.find('[data-test-id="cancel-button"]')

    expect(cancelButton.exists()).toBe(true)

    await cancelButton.trigger('click')
    await flushPromises()

    expect(mockRouter.go).toHaveBeenCalledWith(-1)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })
  it('Calls router.push with correct arguments when backToTheHistoryLast is false', async () => {
    const mockRouter = useRouter()

    const wrapper = mountComponent({
      pageType: PageType.Update,
      useEntity: useMockForm,
      config: new BaseSectionConfig({
        backToTheHistoryLast: false,
      }),
      withReadAction: false,
    })

    const cancelButton = wrapper.find('[data-test-id="cancel-button"]')

    expect(cancelButton.exists()).toBe(true)

    await cancelButton.trigger('click')
    await flushPromises()

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'mock-formList' })
  })
  it('Calls basePermissions and passes correct slot props', () => {
    const config = new BaseSectionConfig()

    const wrapper = mount(BaseSection, {
      props: {
        pageType: PageType.Update,
        useEntity: useMockForm,
        config: new BaseSectionConfig({
          backToTheHistoryLast: false,
        }),
        withReadAction: false,
      },
      global: {
        plugins: [mockStore],
        stubs: {
          VBtn: { template: '<button><slot /></button>' },
        },
        provide: { modal: mockModal },
      },
      slots: {
        default: `<template #default="{ canCreateSeo, canUpdate, canUpdateSeo, canRemove, canViewSeo }">
          <div
            data-test-id="slot-content"
            :data-can-create-seo="canCreateSeo"
            :data-can-update="canUpdate"
            :data-can-update-seo="canUpdateSeo"
            :data-can-remove="canRemove"
            :data-can-view-seo="canViewSeo"
          />
        </template>`,
      },
    })

    expect(basePermissions).toHaveBeenCalledWith({
      entityName: 'mock-form',
      config,
    })

    const slotContent = wrapper.find('[data-test-id="slot-content"]')

    expect(slotContent.exists()).toBe(true)

    expect(slotContent.attributes('data-can-create-seo')).toBe('true')
    expect(slotContent.attributes('data-can-update')).toBe('true')
    expect(slotContent.attributes('data-can-update-seo')).toBe('false')
    expect(slotContent.attributes('data-can-remove')).toBe('false')
    expect(slotContent.attributes('data-can-view-seo')).toBe('true')
  })

  it('Calls onSave and handles success correctly', async () => {
    const mockStoreDispatch = vi.spyOn(mockStore, 'dispatch').mockResolvedValueOnce({ id: '456' })

    const wrapper = mountComponent({
      pageType: PageType.Create,
      useEntity: useMockForm,
      config: sectionConfig,
    })

    wrapper.vm.transformedForm = { id: '123' }
    await wrapper.vm.onSave()

    expect(mockStoreDispatch).toHaveBeenCalledWith('baseStoreCore/createEntity', {
      type: 'mock-form',
      data: {
        form: { id: '123' },
        formRef: wrapper.vm.formRef,
      },
    })

    expect(pushMock).toHaveBeenCalledWith({
      name: 'mock-formList',
    })
  })
})
