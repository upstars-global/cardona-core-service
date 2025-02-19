import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import NameWithIdField from '../../../../../../../src/components/templates/BaseList/_components/fields/NameWithIdField.vue'

vi.mock('vuex', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useStore: () => ({ getters: { userInfo: { id: 'dummy' } } }),
  }
})

describe('NameWithIdField - routePath computed', () => {
  let props: {
    item: Record<string, any>
    getUpdateRoute?: (item: Record<string, any>) => any
    getDetailsRoute?: (item: Record<string, any>) => any
    isShowYou?: boolean
    isShort?: boolean
  }

  beforeEach(() => {
    props = {
      item: { id: '123', name: 'Test' },
      getUpdateRoute: undefined,
      getDetailsRoute: undefined,
      isShowYou: false,
      isShort: false,
    }
  })

  it('returns details route if provided', () => {
    props.getDetailsRoute = item => ({
      name: `${item.name}Card`,
      params: { id: item.id },
      path: `/card/${item.id}`,
    })

    const wrapper = shallowMount(NameWithIdField, { props })

    expect(wrapper.vm.routePath).toEqual(props.getDetailsRoute(props.item))
  })

  it('returns update route if details route is missing', () => {
    props.getDetailsRoute = undefined
    props.getUpdateRoute = item => ({
      name: `${item.name}Update`,
      params: { id: item.id },
      path: `/update/${item.id}`,
    })

    const wrapper = shallowMount(NameWithIdField, { props })

    expect(wrapper.vm.routePath).toEqual(props.getUpdateRoute(props.item))
  })

  it('returns null if both routes are missing', () => {
    props.getDetailsRoute = undefined
    props.getUpdateRoute = undefined

    const wrapper = shallowMount(NameWithIdField, { props })

    expect(wrapper.vm.routePath).toBeNull()
  })
})
