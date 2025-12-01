import { createRouter, createWebHistory } from 'vue-router/auto'
import { SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import {UseEntityType} from "../../../../src/@model/templates/baseSection";
import {vi} from "vitest";
import {createStore} from "vuex";

const routes = [
  { path: '/mock-form-list', name: 'mock-formList', component: { template: '<div>Mock Form List</div>' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export const FieldGeneratorStub = {
  template: '<div class="field-generator-stub" />',
}

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

export const useMockForm = (): UseEntityType<MockForm> => {
  const EntityFormClass = MockForm

  return {
    entityName: 'mock-form',
    EntityFormClass,
    loadingEndpointArr: ['/test-endpoint'],
  }
}

export const createEntity = vi.fn()
export const updateEntity = vi.fn()
export const readEntity = vi.fn()
export const deleteEntity = vi.fn()

export const mockBaseStoreCore = {
  createEntity,
  updateEntity,
  readEntity,
  deleteEntity,
}


export const mockStore = createStore({
  state: {
    errorUrls: [],
  },
  getters: {
    isLoadingPage: vi.fn(() => false),
    abilityCan: vi.fn(() => vi.fn(() => true)),
    isErrorEndpoint: () => vi.fn(() => false),
  },
  actions: {
    resetErrorUrls: vi.fn(),
  },
})


export const goMock = vi.fn()
export const pushMock = vi.fn()
