import { beforeEach, describe, it, vi } from 'vitest'
import ViewGenerator from '../../../src/components/templates/ViewGenerator/index.vue'
import { ViewType } from '../../../src/@model/view'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../src/@model/enums/icons'
import { testingDate } from '../templates/shared-tests/date-and-dateTimeField'
import { fullDate } from '../../../src/utils/date'

const getMountViewGenerator = setMountComponent(ViewGenerator)

const mockStore = {
  getters: {
    abilityCan: vi.fn(),
  },
}

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => ({
      getters: mockStore.getters,
    }),
  }
})

const modelValue = {
  type: ViewType.BadgeCopy,
  value: 'Test Value',
  label: 'Test Label',
  icon: IconsList.StarIcon,
  withSeparator: false,
  permission: 'view_permission',
}

describe('ViewGenerator.vue', () => {
  const defaultProps = {
    modelValue,
    keyName: 'testKey',
    justifyContent: 'center',
    cols: 4,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const testIdLabel = 'label'
  const testIdViewGeneratorComponent = 'view-generator-component'
  const testIdIcon = 'icon'
  const testIdSeparator = 'separator'

  it('Renders label and value correctly when user has permission without separator and use ViewType component', async () => {
    mockStore.getters.abilityCan.mockReturnValue(true)

    const wrapper = getMountViewGenerator(defaultProps)

    testOn.equalTextValue({ wrapper, testId: testIdLabel }, modelValue.label)
    testOn.equalTextValue({ wrapper, testId: testIdViewGeneratorComponent }, modelValue.value)
    testOn.existClass({ wrapper, testId: testIdIcon }, modelValue.icon)
    testOn.notExistElement({ wrapper, testId: testIdSeparator })
  })
  it('Renders label and value correctly when user has permission with separator and use ViewType component', async () => {
    mockStore.getters.abilityCan.mockReturnValue(true)

    const modelValue = {
      label: 'Second label',
      value: new Date(testingDate),
      type: ViewType.Date,
      withSeparator: true,
      icon: undefined,
    }

    const wrapper = getMountViewGenerator({
      ...defaultProps,
      modelValue: {
        ...modelValue,
      },
    })

    testOn.equalTextValue({ wrapper, testId: testIdLabel }, modelValue.label)
    testOn.equalTextValue({ wrapper, testId: testIdViewGeneratorComponent }, fullDate(modelValue.value))
    testOn.notExistElement({ wrapper, testId: testIdIcon })
    testOn.existElement({ wrapper, testId: testIdSeparator })
  })

  it('Not renders component without access permission', async () => {
    mockStore.getters.abilityCan.mockReturnValue(false)

    const modelValue = {
      label: 'Second label',
      value: new Date(testingDate),
      type: ViewType.Date,
      withSeparator: true,
      icon: undefined,
    }

    const wrapper = getMountViewGenerator({
      ...defaultProps,
      modelValue: {
        ...modelValue,
      },
    })

    console.log(wrapper.html(), '1111')

    testOn.equalTextValue({ wrapper, testId: testIdLabel }, modelValue.label)
    testOn.equalTextValue({ wrapper, testId: testIdViewGeneratorComponent }, fullDate(modelValue.value))
    testOn.notExistElement({ wrapper, testId: testIdIcon })
    testOn.existElement({ wrapper, testId: testIdSeparator })
  })
})
