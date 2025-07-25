import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { useRouter } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router/auto'
import type { UseEntityType } from '../../../../src/components/templates/BaseSection/index.vue'
import BaseSection from '../../../../src/components/templates/BaseSection/index.vue'
import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { PageType } from '../../../../src/@model/templates/baseSection'
import { clickTrigger, getSelectorTestId, getWrapperElement, setMountComponent } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { basePermissions } from '../../../../src/helpers/base-permissions'
import { useRedirectToNotFoundPage } from '../../../../src/helpers/router'
import { setTabError } from '../../../../src/components/templates/BaseSection/composables/tabs'
import * as loaderStoreModule from '../../../../src/stores/loader'

const getMountBaseSection = setMountComponent(BaseSection)

const FieldGeneratorStub = {
  template: '<div class="field-generator-stub" />',
}

const routes = [
  { path: '/mock-form-list', name: 'mock-formList', component: { template: '<div>Mock Form List</div>' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
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


const mockStore = createStore({
  state: {
    errorUrls: [],
  },
  getters: {
    // isLoadingEndpoint: () => vi.fn(() => false),
    isLoadingPage: vi.fn(() => false),
    abilityCan: () => true,
    isErrorEndpoint: () => vi.fn(() => false),
  },
  actions: {
    'resetErrorUrls': vi.fn(),
    'textEditor/setVariableTextBuffer': vi.fn(() => Promise.resolve()),
    'baseStoreCore/readEntity': vi.fn(() => Promise.resolve()),
    'baseStoreCore/createEntity': vi.fn(() => Promise.resolve()),
    'baseStoreCore/updateEntity': vi.fn(() => Promise.resolve()),
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
      routes,
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

vi.mock('../../../../src/components/templates/BaseSection/composables/tabs', () => ({
  setTabError: vi.fn(),
}))

const mountComponent = (props = {}, global = {}, slots = {}) =>
  getMountBaseSection({
    config: sectionConfig,
    useEntity: useMockForm,
    ...props,
  }, {
    plugins: [mockStore, router],
    stubs: {
      VBtn: { template: '<button><slot /></button>' },
    },
    ...global,
    provide: { modal: mockModal },
    components: {
      FieldGenerator: FieldGeneratorStub,
    },
  }, {
    default: `<template #default="{ form }">
                  <FieldGenerator v-model="form.isActive" />
                </template>`,
    ...slots,
  },
  )

let mockRouter
beforeEach(() => {
  mockRouter = useRouter()
  setActivePinia(createPinia())
})

afterEach(() => {
  // Сбрасываем все вызовы моков после каждого теста
  vi.clearAllMocks()
})

describe('BaseSection.vue', () => {
  it('Renders correctly when form is present', async () => {
    /// Mount the component with required props
    const wrapper = mountComponent({
      pageType: PageType.Create,
      withReadAction: false,
    })

    /// Wait for Vue lifecycle hooks to complete
    await wrapper.vm.$nextTick()

    /// Check that the main base section renders successfully
    testOn.existElement({ wrapper, testId: 'base-section' })
  })

  it('Calls onSubmit with false when "Create and Exit" button is clicked', async () => {
    /// Mock the onSubmit function
    const onSubmitMock = vi.fn()

    /// Mount the component and inject the mocked function
    const wrapper = mountComponent({
      pageType: PageType.Create,
      withReadAction: false,
    })

    wrapper.vm.onSubmit = onSubmitMock

    /// Check that save button is not rendered
    testOn.notExistElement({ wrapper, testId: 'save-button' })

    /// Trigger click on "Create and Exit" button
    const buttonCreate = wrapper.find(getSelectorTestId('create-button'))

    await buttonCreate.trigger('click')

    /// Verify that the mocked function was called
    expect(onSubmitMock).toHaveBeenCalled()
  })

  it('Triggers remove modal on remove button click', async () => {
    /// Mount the component in update mode
    const wrapper = mountComponent({
      pageType: PageType.Update,
    })

    /// Spy on the modal show method
    const modalSpy = vi.spyOn(mockModal, 'showModal')

    /// Trigger the onClickRemove method
    await wrapper.vm.onClickRemove()

    /// Verify that the modal is shown with the correct ID
    expect(modalSpy).toHaveBeenCalledWith('form-item-remove-modal')
  })

  it('Validates form and handles errors correctly', async () => {
    /// Mount the component in update mode
    const wrapper = mountComponent({
      pageType: PageType.Update,
    })

    /// Mock the form validation methods
    const formRefMock = {
      validate: vi.fn(() => Promise.resolve({ valid: false })),
      getErrors: vi.fn(() => ({ isActive: { isNotEmpty: true } })),
    }

    wrapper.vm.formRef = formRefMock

    /// Call the validate method
    const validateResult = await wrapper.vm.validate()

    /// Verify that the validation fails and the mocked method is called
    expect(validateResult).toBe(false)
    expect(formRefMock.validate).toHaveBeenCalled()
  })

  it('Shows loading state when isLoading is true', () => {
    // Init test Pinia
    setActivePinia(createPinia())

    /// Mocking loader state
    const loaderStoreSpy = vi.spyOn(loaderStoreModule, 'useLoaderStore').mockReturnValue({
      isLoadingEndpoint: () => true,
    })

    // Монтируем компонент
    const wrapper = mountComponent({
      pageType: PageType.Update,
      withReadAction: false,
    })

    // Check render loader
    testOn.existElement({ wrapper, testId: 'loader' })
    loaderStoreSpy.mockRestore()
  })

  it('Calls onClickCancel when cancel button is clicked', async () => {
    /// Mount the component with "backToTheHistoryLast" set to true
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
      }),
      withReadAction: false,
    })

    /// Mock the onClickCancel method
    const onClickCancelMock = vi.fn()

    wrapper.vm.onClickCancel = onClickCancelMock

    /// Trigger the cancel button click
    await clickTrigger({ wrapper, testId: 'cancel-button' })

    await flushPromises()

    /// Verify that the router navigates back
    expect(mockRouter.go).toHaveBeenCalledWith(-1)

    /// Ensure that push method was not called
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('Calls router.push with correct arguments when backToTheHistoryLast is false', async () => {
    /// Mount the component with "backToTheHistoryLast" set to false
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: false,
      }),
      withReadAction: false,
    }, {
      mocks: {
        isExistsListPage: true,
      },
    })

    /// Trigger the cancel button click
    await clickTrigger({ wrapper, testId: 'cancel-button' })

    /// Verify that the router pushes to the correct route
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'mock-formList' })
  })

  it('Calls basePermissions and passes correct slot props', () => {
    /// Mount the component with default slot
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: false,
      }),
      withReadAction: false,
    }, {}, {
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
    })

    /// Verify that basePermissions was called with correct arguments
    expect(basePermissions).toHaveBeenCalledWith({
      entityName: 'mock-form',
      config: sectionConfig,
    })

    /// Verify the slot props passed correctly
    const slotContent = getWrapperElement({ wrapper, testId: 'slot-content' }) as VueWrapper

    testOn.existElement({ wrapper: slotContent })

    expect(slotContent.attributes('data-can-create-seo')).toBe('true')
    expect(slotContent.attributes('data-can-update')).toBe('true')
    expect(slotContent.attributes('data-can-update-seo')).toBe('false')
    expect(slotContent.attributes('data-can-remove')).toBe('false')
    expect(slotContent.attributes('data-can-view-seo')).toBe('true')
  })

  it('Calls onSave and handles success correctly', async () => {
    /// Spy on the store dispatch method
    const mockStoreDispatch = vi.spyOn(mockStore, 'dispatch').mockResolvedValueOnce({ id: '456' })

    /// Mount the component in create mode
    const wrapper = mountComponent({
      pageType: PageType.Create,
    })

    /// Mock transformed form data
    wrapper.vm.transformedForm = { id: '123' }

    /// Call the onSave method
    await wrapper.vm.onSave()

    /// Verify that the correct dispatch action is called //
    expect(mockStoreDispatch).toHaveBeenCalledWith('baseStoreCore/createEntity', {
      type: 'mock-form',
      data: {
        form: { id: '123' },
        formRef: {
          validationErrorCb: undefined,
        },
      },
    })

    /// Verify that the router navigates to the list page
    expect(pushMock).toHaveBeenCalledWith({
      name: 'mock-formList',
    })
  })

  it('Activates correct tab and scrolls to field with error', async () => {
    /// Create mock DOM elements for testing tab activation
    const mainTabElement = document.createElement('div')

    mainTabElement.setAttribute('data-tab', 'main')

    const fieldErrorElement = document.createElement('input')

    fieldErrorElement.setAttribute('id', 'field-error')

    mainTabElement.appendChild(fieldErrorElement)
    document.body.appendChild(mainTabElement)

    /// Mount the component
    const wrapper = mountComponent({
      pageType: PageType.Create,
    })

    const formRefMock = {
      validate: vi.fn(() => Promise.resolve({ valid: false })),
      getErrors: vi.fn(() => ({ isActive: { isNotEmpty: true } })),
    }

    wrapper.vm.formRef = formRefMock

    /// Call the validate method
    await wrapper.vm.validate()

    expect(setTabError).toHaveBeenCalled()
  })

  it('Redirects to not found page when entity fetch fails', async () => {
    /// Spy on the store dispatch method to simulate rejection
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch').mockRejectedValueOnce({ type: 'NOT_FOUND' })

    /// Provide the mocked redirect method
    const redirectToNotFoundPage = useRedirectToNotFoundPage(mockRouter)

    /// Mount the component in update mode
    mountComponent(
      {
        pageType: PageType.Update,
      },
      {
        provide: {
          redirectToNotFoundPage,
        },
      },
    )

    /// Wait for Vue lifecycle hooks to complete
    await flushPromises()

    /// Verify that the correct action is dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(
      'baseStoreCore/readEntity',
      expect.objectContaining({ id: '123' }),
    )

    /// Verify that the router navigates to the not found page
    expect(pushMock).toHaveBeenCalledWith({ name: 'NotFound' })
  })

  it('test', async () => {
    await router.isReady()

    /// Spy on the store dispatch method
    vi.spyOn(mockStore, 'dispatch').mockResolvedValueOnce({ id: '456' })

    /// Mount the component in create mode
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
        isModalSection: true,
      }),
    })

    await flushPromises()

    const saveAndStayButton = wrapper.find(getSelectorTestId('saveAndExit-button'))

    expect(saveAndStayButton.exists()).toBe(true)

    // In the modal section, text of the "Save and stay" button should be "Save"
    expect(saveAndStayButton.text()).toBe('Save')

    // In the modal section, the "Save and stay" button should not be displayed
    expect(wrapper.find(getSelectorTestId('saveAndStay-button')).exists()).toBe(false)
  })

  it('Check actions of router on  click buttons "Save and stay",  "Save and exit"', async () => {
    await router.replace({ path: '/detail' })
    await router.isReady()

    // Set router config `router.options.history.state.back = true`
    Object.defineProperty(router.options.history, 'state', {
      value: { back: true },
      writable: true,
    })

    /// Spy on the store dispatch method
    vi.spyOn(mockStore, 'dispatch').mockResolvedValueOnce({ id: '456' })

    /// Mount the component in create mode
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
      }),
    })

    await flushPromises()

    /// Check that will not be any redirect after update
    await clickTrigger({ wrapper, testId: 'saveAndStay-button' })

    await flushPromises()

    expect(mockRouter.go).not.toHaveBeenCalledWith(-1)
    expect(mockRouter.push).not.toHaveBeenCalled()

    /// Check that will be redirect after update

    await clickTrigger({ wrapper, testId: 'saveAndExit-button' })

    await flushPromises()

    expect(mockRouter.go).toHaveBeenCalledWith(-1)
  })

  it('Check call action read entity after click on "save and stay"', async () => {
    // Spy and mock dispatch once
    const dispatchSpy = vi
      .spyOn(mockStore, 'dispatch')
      .mockResolvedValueOnce({ id: '456' })

    await router.replace({ path: '/detail' })
    await router.isReady()

    // Set router config `router.options.history.state.back = true`
    Object.defineProperty(router.options.history, 'state', {
      value: { back: true },
      writable: true,
    })

    /// Mount the component in update mode
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
        initializeWithUpdate: true,
      }),
    })

    const loaderStore = loaderStoreModule.useLoaderStore()

    await flushPromises()

    // Click on button save and stay
    await clickTrigger({ wrapper, testId: 'saveAndStay-button' })
    loaderStore.setLoaderOn('mock-form/update')
    await flushPromises()

    // Check request on read entity after update
    expect(dispatchSpy).toHaveBeenCalledWith(
      'baseStoreCore/readEntity',
      expect.objectContaining({ id: '123' }),
    )
  })
})
