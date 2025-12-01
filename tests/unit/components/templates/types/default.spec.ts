import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { useRouter } from 'vue-router'
import '../../../mocks/base-section/static'
import BaseSectionDefault from '../../../../../src/components/templates/BaseSection/types/default.vue'
import { BaseSectionConfig } from '../../../../../src/@model/templates/baseList'
import { mockModal } from '../../../mocks/modal-provide-config'
import { PageType } from '../../../../../src/@model/templates/baseSection'
import { clickTrigger, getSelectorTestId, getWrapperElement, setMountComponent } from '../../../utils'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { basePermissions } from '../../../../../src/helpers/base-permissions'
import * as loaderStoreModule from '../../../../../src/stores/loader'
import { setTabError } from '../../../../../src/components/templates/BaseSection/composables/tabs'
import {
  FieldGeneratorStub,
  createEntity, goMock,
  mockStore,
  pushMock,
  readEntity,
  router, updateEntity, useMockForm,
} from '../../../mocks/base-section/utils'

const getMountComponent = setMountComponent(BaseSectionDefault)

const routes = [
  { path: '/mock-form-list', name: 'mock-formList', component: { template: '<div>Mock Form List</div>' } },
]

const sectionConfig = new BaseSectionConfig({})

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

const mountComponent = (props = {}, global = {}, slots = {}) =>
  getMountComponent({
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
  // Reset mocks after run each test
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
    testOn.existElement({ wrapper, testId: 'base-section-default' })
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
    expect(modalSpy).toHaveBeenCalledWith('form-item-remove-modal-mock-form')
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
    // make createEntity return success with id
    createEntity.mockResolvedValueOnce({ id: '456' })

    // Mount the component in create mode
    const wrapper = mountComponent({
      pageType: PageType.Create,
    })

    // Mock transformed form data
    wrapper.vm.transformedForm = { id: '123' }

    // Call the onSave method
    await wrapper.vm.onSave()

    // Verify that createEntity from Pinia store was called
    expect(createEntity).toHaveBeenCalledWith({
      type: 'mock-form',
      data: {
        form: { id: '123' },
        formRef: {
          validationErrorCb: undefined,
        },
      },
    })

    // Verify that the router navigates to the list page
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
    // Make readEntity reject with NOT_FOUND
    readEntity.mockRejectedValueOnce({ type: 'NOT_FOUND' })

    // Mount the component in update mode
    mountComponent({
      pageType: PageType.Update,
    })

    await flushPromises()

    // Verify that readEntity was called with correct arguments
    expect(readEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mock-form',
        id: '123',
      }),
    )

    // Verify that the router navigates to the not found page
    expect(pushMock).toHaveBeenCalledWith({ name: 'NotFound' })
  })

  it('Shows correct buttons and labels in modal section', async () => {
    await router.isReady()

    // Emulate readEntity
    readEntity.mockResolvedValueOnce({ id: '456' })

    // Mount the component в режимі Update + isModalSection
    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
        isModalSection: true,
      }),
    })

    await flushPromises()

    // Find and get wrapper button "saveAndExit"
    const saveAndExitButton = wrapper.find(getSelectorTestId('saveAndExit-button'))

    expect(saveAndExitButton.exists()).toBe(true)

    // Check exist button "Save"
    expect(saveAndExitButton.text()).toBe('Save')

    // Check that not exist button "saveAndStay" in modal
    expect(wrapper.find(getSelectorTestId('saveAndStay-button')).exists()).toBe(false)
  })

  it('Check actions of router on click buttons "Save and stay" and "Save and exit"', async () => {
    await router.replace({ path: '/detail' })
    await router.isReady()
    readEntity.mockResolvedValueOnce({ id: '456' })

    // Emulation back history
    Object.defineProperty(router.options.history, 'state', {
      value: { back: true },
      writable: true,
    })

    // Emulate  updateEntity
    updateEntity.mockResolvedValue({ id: '456' })

    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
      }),
    })

    await flushPromises()

    // On  "Save and stay" should`nt be redirect
    await clickTrigger({ wrapper, testId: 'saveAndStay-button' })
    await flushPromises()

    expect(mockRouter.go).not.toHaveBeenCalledWith(-1)
    expect(mockRouter.push).not.toHaveBeenCalled()

    // On click "Save and exit" should be redirect on prev page
    updateEntity.mockResolvedValueOnce({ id: '456' })
    await clickTrigger({ wrapper, testId: 'saveAndExit-button' })
    await flushPromises()

    expect(mockRouter.go).toHaveBeenCalledWith(-1)
  })

  it('Calls readEntity after click on "save and stay"', async () => {
    await router.replace({ path: '/detail' })
    await router.isReady()
    readEntity.mockResolvedValueOnce({ id: '456' })

    // Emulation back history
    Object.defineProperty(router.options.history, 'state', {
      value: { back: true },
      writable: true,
    })

    // Emulate  updateEntity
    updateEntity.mockResolvedValueOnce({ id: '456' })

    const wrapper = mountComponent({
      pageType: PageType.Update,
      config: new BaseSectionConfig({
        backToTheHistoryLast: true,
        initializeWithUpdate: true,
      }),
    })

    const loaderStore = loaderStoreModule.useLoaderStore()

    await flushPromises()

    // Click on "save and stay"
    await clickTrigger({ wrapper, testId: 'saveAndStay-button' })
    loaderStore.setLoaderOn('mock-form/update')

    await flushPromises()

    // Check read entity after update
    expect(readEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mock-form',
        id: '123',
      }),
    )
  })
})
