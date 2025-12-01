import { afterEach, describe, it, vi } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router/auto'
import type { UseEntityType } from '../../../../src/components/templates/BaseSection/index.vue'
import BaseSection from '../../../../src/components/templates/BaseSection/index.vue'
import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { PageType } from '../../../../src/@model/templates/baseSection'
import { setMountComponent } from '../../utils'
import DefaultBaseSection from '../../../../src/components/templates/BaseSection/types/default.vue'
import { testOn } from '../../templates/shared-tests/test-case-generator'

vi.mock('../../../../src/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => mockBaseStoreCore,
}))

const getMountComponent = setMountComponent(BaseSection)

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
const createEntity = vi.fn()
const updateEntity = vi.fn()
const readEntity = vi.fn()
const deleteEntity = vi.fn()

const mockBaseStoreCore = {
  createEntity,
  updateEntity,
  readEntity,
  deleteEntity,
}

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
    isLoadingPage: vi.fn(() => false),
    abilityCan: () => true,
    isErrorEndpoint: () => vi.fn(() => false),
  },
  actions: {
    resetErrorUrls: vi.fn(),
  },
})

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseSection,
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

afterEach(() => {
  // Reset mocks after run each test
  vi.clearAllMocks()
})

describe('BaseSection.vue', () => {
  it('Render is default base section', async () => {
    /// Mount the component with required props
    const wrapper = mountComponent({
      pageType: PageType.Empty,
      withReadAction: false,
    })

    /// Wait for Vue lifecycle hooks to complete
    await wrapper.vm.$nextTick()

    /// Check that the main base section renders successfully
    testOn.existElement({ wrapper, testId: 'base-section-default' })
  })
})
