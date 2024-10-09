// import { setMountComponent } from '../utils'

// const getMountViewGenerator = setMountComponent(ViewGenerator)

import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ViewGenerator from '../../../src/components/templates/ViewGenerator/index.vue'

const mockStore = {
  getters: {
    abilityCan: vi.fn(),
  },
}

// Мокаем useStore
vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => ({
      getters: mockStore.getters,
    }),
  }
})

describe('ViewGenerator.vue', () => {
  const defaultProps = {
    modelValue: {
      label: 'Test Label',
      value: 'Test Value',
      permission: 'test-permission', // Указываем permission
      withSeparator: true,
    },
    keyName: 'testKey',
    justifyContent: 'center',
    cols: 4,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders label and value correctly when user has permission', async () => {
    mockStore.getters.abilityCan.mockReturnValue(true)

    const wrapper = mount(ViewGenerator, {
      props: defaultProps,
    })

    console.log('!!!! Wrapper HTML:', wrapper.html()) // Добавим больше информации

    expect(wrapper.exists()).toBe(true) // Проверим, что компонент вообще рендерится
    expect(wrapper.html()).toContain('Test Label') // Проверим наличие рендера строки
    expect(wrapper.html()).toContain('Test Value')
  })
})

// it('does not render component when user does not have permission', async () => {
//   // Устанавливаем возвращаемое значение abilityCan как false (пользователь не имеет разрешения)
//   mockStore.getters.abilityCan.mockReturnValue(false)
//
//   const wrapper = mount(ViewGenerator, {
//     props: defaultProps,
//   })
//
//   expect(wrapper.html()).toBeFalsy() // Компонент не должен рендериться
// })
//
// it('applies the correct justify content class', async () => {
//   mockStore.getters.abilityCan.mockReturnValue(true)
//
//   const wrapper = mount(ViewGenerator, {
//     props: defaultProps,
//   })
//
//   expect(wrapper.find('.wrapper-value').classes()).toContain('justify-content-center')
// })
//
// it('computes correct valueColsCount based on props.cols', async () => {
//   mockStore.getters.abilityCan.mockReturnValue(true)
//
//   const wrapper = mount(ViewGenerator, {
//     props: { ...defaultProps, cols: 4 },
//   })
//
//   const valueColsCount = 12 - 4
//   expect(wrapper.find('.wrapper-value').attributes('cols')).toBe(String(valueColsCount))
// })
