import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import '../../../mocks/baselist/static-mock'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { setMountComponent } from '../../../utils'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { mockBaseStoreCore } from '../../../mocks/baselist/utils'
import {
  defaultProps,
  global,
  mockCustomStore,
  useListForCustomStore,
} from '../../../mocks/base-list/utils'

let props

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseList,
  }
})

const getMountComponent = setMountComponent(BaseList)
const getMountDefaultComponent = setMountComponent(DefaultBaseList)

describe('BaseList.vue (with mocked dynamic import)', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should run set valid component and call fetch', async () => {
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    props.config.onePermissionKey = 'test-super'

    const wrapper = getMountComponent(props, global)

    testOn.existElement({ wrapper, testId: 'default-base-list' })

    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
  })
})

describe('DefaultBaseList.vue - useStore vs baseStoreCore', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchEntityList', () => {
    it('calls baseStoreCore.fetchEntityList on mount when useStore is not provided', async () => {
      getMountDefaultComponent(props, global)

      await flushPromises()

      expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'Test' }),
      )
    })

    it('calls customStore.fetchEntityList and not baseStoreCore when useStore is provided', async () => {
      mockCustomStore.fetchEntityList.mockResolvedValueOnce({ list: [], total: 0 })

      getMountDefaultComponent({ ...props, useList: useListForCustomStore(mockCustomStore) }, global)

      await flushPromises()

      expect(mockCustomStore.fetchEntityList).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'Test' }),
      )
      expect(mockBaseStoreCore.fetchEntityList).not.toHaveBeenCalled()
    })

    it('passes correct pagination params to fetchEntityList', async () => {
      getMountDefaultComponent(props, global)

      await flushPromises()

      expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            page: 1,
            perPage: expect.any(Number),
          }),
        }),
      )
    })

    it('passes entityName as type to fetchEntityList', async () => {
      getMountDefaultComponent(props, global)

      await flushPromises()

      expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'Test' }),
      )
    })
  })

  describe('deleteEntity', () => {
    it('calls baseStoreCore.deleteEntity when useStore is not provided', async () => {
      mockBaseStoreCore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })

      const wrapper = getMountDefaultComponent(props, global)

      await flushPromises()

      wrapper.vm.selectedItem = { id: '1' }
      await wrapper.vm.onClickModalOk({ hide: vi.fn(), commentToRemove: '' })
      await flushPromises()

      expect(mockBaseStoreCore.deleteEntity).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'Test', id: '1' }),
      )
    })

    it('calls customStore.deleteEntity and not baseStoreCore when useStore is provided', async () => {
      mockCustomStore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })
      mockCustomStore.deleteEntity.mockResolvedValueOnce({})

      const wrapper = getMountDefaultComponent(
        { ...props, useList: useListForCustomStore(mockCustomStore) },
        global,
      )

      await flushPromises()

      wrapper.vm.selectedItem = { id: '1' }
      await wrapper.vm.onClickModalOk({ hide: vi.fn(), commentToRemove: '' })
      await flushPromises()

      expect(mockCustomStore.deleteEntity).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'Test', id: '1' }),
      )
      expect(mockBaseStoreCore.deleteEntity).not.toHaveBeenCalled()
    })

    it('refetches list after successful delete', async () => {
      mockBaseStoreCore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })

      const wrapper = getMountDefaultComponent(props, global)

      await flushPromises()

      const callCountBeforeDelete = mockBaseStoreCore.fetchEntityList.mock.calls.length

      wrapper.vm.selectedItem = { id: '1' }
      await wrapper.vm.onClickModalOk({ hide: vi.fn(), commentToRemove: '' })
      await flushPromises()

      expect(mockBaseStoreCore.fetchEntityList.mock.calls.length).toBeGreaterThan(callCountBeforeDelete)
    })
  })

  describe('updateEntity (toggle status)', () => {
    it('calls baseStoreCore.updateEntity for toggle status when useStore is not provided', async () => {
      const wrapper = getMountDefaultComponent(props, global)

      await flushPromises()

      await wrapper.vm.onClickToggleStatus({ id: '1', isActive: true })
      await flushPromises()

      expect(mockBaseStoreCore.updateEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Test',
          data: { form: { id: '1', isActive: false } },
        }),
      )
    })

    it('calls baseStoreCore.updateEntity for toggle status even when useStore is provided', async () => {
      // toggle status always uses baseStoreCore regardless of custom store
      mockCustomStore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })

      const wrapper = getMountDefaultComponent(
        { ...props, useList: useListForCustomStore(mockCustomStore) },
        global,
      )

      await flushPromises()

      await wrapper.vm.onClickToggleStatus({ id: '1', isActive: false })
      await flushPromises()

      expect(mockBaseStoreCore.updateEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Test',
          data: { form: { id: '1', isActive: true } },
        }),
      )
      expect(mockCustomStore.updateEntity).not.toHaveBeenCalled()
    })
  })
})
