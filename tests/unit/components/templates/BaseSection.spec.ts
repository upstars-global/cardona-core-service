// import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// import { createPinia, setActivePinia } from 'pinia'
// import type { VueWrapper } from '@vue/test-utils'
// import { flushPromises } from '@vue/test-utils'
// import { createStore } from 'vuex'
// import { useRouter } from 'vue-router'
// import { createRouter, createWebHistory } from 'vue-router/auto'
// import type { UseEntityType } from '../../../../src/components/templates/BaseSection/index.vue'
// import BaseSection from '../../../../src/components/templates/BaseSection/index.vue'
// import { BaseSectionConfig } from '../../../../src/@model/templates/baseList'
// import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
// import { i18n } from '../../../../src/plugins/i18n'
// import { mockModal } from '../../mocks/modal-provide-config'
// import { PageType } from '../../../../src/@model/templates/baseSection'
// import { clickTrigger, getSelectorTestId, getWrapperElement, setMountComponent } from '../../utils'
// import { testOn } from '../../templates/shared-tests/test-case-generator'
// import { basePermissions } from '../../../../src/helpers/base-permissions'
// import { setTabError } from '../../../../src/components/templates/BaseSection/composables/tabs'
// import * as loaderStoreModule from '../../../../src/stores/loader'
//
// vi.mock('../../../../src/stores/baseStoreCore', () => ({
//   useBaseStoreCore: () => mockBaseStoreCore,
// }))
//
// const getMountBaseSection = setMountComponent(BaseSection)
//
// const FieldGeneratorStub = {
//   template: '<div class="field-generator-stub" />',
// }
//
// const routes = [
//   { path: '/mock-form-list', name: 'mock-formList', component: { template: '<div>Mock Form List</div>' } },
// ]
//
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })
//
// class MockForm {
//   readonly id?: string
//   readonly isActive: SwitchBaseField
//
//   constructor(data: { id?: string; isActive: boolean }) {
//     this.id = data?.id
//     this.isActive = new SwitchBaseField({
//       key: 'isActive',
//       value: data?.isActive,
//       label: i18n.t('userStatuses.active'),
//     })
//   }
// }
//
// const sectionConfig = new BaseSectionConfig({})
// const createEntity = vi.fn()
// const updateEntity = vi.fn()
// const readEntity = vi.fn()
// const deleteEntity = vi.fn()
//
// const mockBaseStoreCore = {
//   createEntity,
//   updateEntity,
//   readEntity,
//   deleteEntity,
// }
//
// const useMockForm = (): UseEntityType<MockForm> => {
//   const EntityFormClass = MockForm
//
//   return {
//     entityName: 'mock-form',
//     EntityFormClass,
//     loadingEndpointArr: ['/test-endpoint'],
//   }
// }
//
// vi.mock('path/to/generateEntityUrl', () => ({
//   generateEntityUrl: vi.fn(() => '/mock-entity-url'),
// }))
//
// vi.mock('../../../../src/helpers/base-permissions', () => ({
//   basePermissions: vi.fn(() => ({
//     canCreateSeo: true,
//     canUpdate: true,
//     canUpdateSeo: false,
//     canRemove: false,
//     canViewSeo: true,
//   })),
// }))
//
// const mockStore = createStore({
//   state: {
//     errorUrls: [],
//   },
//   getters: {
//     isLoadingPage: vi.fn(() => false),
//     abilityCan: () => true,
//     isErrorEndpoint: () => vi.fn(() => false),
//   },
//   actions: {
//     resetErrorUrls: vi.fn(),
//   },
// })
//
// const goMock = vi.fn()
// const pushMock = vi.fn()
//
// vi.mock('vue-router', async importOriginal => {
//   const actual = await importOriginal()
//
//   return {
//     ...actual,
//     useRoute: vi.fn(() => ({
//       params: { id: '123' },
//       routes,
//       name: 'TestRoute',
//       options: {
//         history: {
//           state: {
//             back: true,
//           },
//         },
//       },
//     })),
//     useRouter: vi.fn(() => ({
//       push: pushMock,
//       go: goMock,
//       options: {
//         history: {
//           state: {
//             back: true,
//           },
//         },
//       },
//     })),
//   }
// })
//
// vi.mock('../../../../src/components/templates/BaseSection/composables/tabs', () => ({
//   setTabError: vi.fn(),
// }))
//
// const mountComponent = (props = {}, global = {}, slots = {}) =>
//   getMountBaseSection({
//     config: sectionConfig,
//     useEntity: useMockForm,
//     ...props,
//   }, {
//     plugins: [mockStore, router],
//     stubs: {
//       VBtn: { template: '<button><slot /></button>' },
//     },
//     ...global,
//     provide: { modal: mockModal },
//     components: {
//       FieldGenerator: FieldGeneratorStub,
//     },
//   }, {
//     default: `<template #default="{ form }">
//                   <FieldGenerator v-model="form.isActive" />
//                 </template>`,
//     ...slots,
//   },
//   )
//
// let mockRouter
// beforeEach(() => {
//   mockRouter = useRouter()
//   setActivePinia(createPinia())
// })
//
// afterEach(() => {
//   // Reset mocks after run each test
//   vi.clearAllMocks()
// })
//
// describe('BaseSection.vue', () => {
//   it('!!!', async () => {
//     // /// Mount the component with required props
//     // const wrapper = mountComponent({
//     //   pageType: PageType.Create,
//     //   withReadAction: false,
//     // })
//     //
//     // /// Wait for Vue lifecycle hooks to complete
//     // await wrapper.vm.$nextTick()
//     //
//     // /// Check that the main base section renders successfully
//     // testOn.existElement({ wrapper, testId: 'base-section' })
//     console.log('Run base section tests')
//   })
// })
