import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import ViewGenerator from '../../../src/components/templates/ViewGenerator/index.vue'
import { ViewType } from '../../../src/@model/view'
import { clickTrigger, setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../src/@model/enums/icons'
import { testingDate } from '../templates/shared-tests/date-and-dateTimeField'
import { fullDate } from '../../../src/utils/date'
import { copyToClipboard } from '../../../src/helpers/clipboard'

const getMountViewGenerator = setMountComponent(ViewGenerator)

const mockAbilityCan = vi.fn()

vi.mock('../../../src/stores/user', () => ({
  useUserStore: () => ({
    abilityCan: mockAbilityCan,
  }),
}))

const testIdLabel = 'label'
const testIdViewGeneratorComponent = 'view-generator-component'
const testIdIcon = 'icon'
const testIdSeparator = 'separator'
const testIdWrapperValue = 'wrapper-value'

const viewValue = 'Test Value'

const createDefaultProps = (modelValueOverrides = {}) => ({
  modelValue: {
    type: ViewType.BadgeCopy,
    value: viewValue,
    label: 'Test Label',
    icon: IconsList.StarIcon,
    withSeparator: false,
    permission: 'view_permission',
    ...modelValueOverrides,
  },
  keyName: 'testKey',
  justifyContent: 'center',
  cols: 4,
})

describe('ViewGenerator.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Renders label and value correctly when user has permission without separator and use ViewType component', async () => {
    mockAbilityCan.mockReturnValue(true)

    const props = createDefaultProps()
    const wrapper = getMountViewGenerator(props)
    const maxCols = 12

    testOn.equalTextValue({ wrapper, testId: testIdLabel }, props.modelValue.label)
    testOn.equalTextValue({ wrapper, testId: testIdViewGeneratorComponent }, viewValue)
    testOn.existClass({ wrapper, testId: testIdIcon }, IconsList.StarIcon)
    testOn.notExistElement({ wrapper, testId: testIdSeparator })
    testOn.existClass({ wrapper, testId: 'wrapper-label' }, `v-col-${props.cols}`)
    testOn.existClass({ wrapper, testId: testIdWrapperValue }, `v-col-${maxCols - props.cols}`)
  })

  it('Renders label and value correctly when user has permission with separator and use ViewType component', async () => {
    const modelValueOverrides = {
      label: 'Second label',
      value: new Date(testingDate),
      type: ViewType.Date,
      withSeparator: true,
      icon: undefined,
      permission: undefined,
    }

    const props = { ...createDefaultProps(modelValueOverrides), justifyContent: 'center' }

    const wrapper = getMountViewGenerator(props)

    testOn.equalTextValue({ wrapper, testId: testIdLabel }, modelValueOverrides.label)
    testOn.equalTextValue({ wrapper, testId: testIdViewGeneratorComponent }, fullDate(new Date(testingDate)))
    testOn.notExistElement({ wrapper, testId: testIdIcon })
    testOn.existElement({ wrapper, testId: testIdSeparator })
    testOn.existClass({ wrapper, testId: testIdWrapperValue }, `justify-content-${props.justifyContent}`)
  })

  it('Does not render component without access permission', async () => {
    mockAbilityCan.mockReturnValue(false)

    const wrapper = getMountViewGenerator(createDefaultProps())

    const testIds = [
      testIdLabel,
      testIdViewGeneratorComponent,
      testIdIcon,
      testIdSeparator,
    ]

    testIds.forEach(testId => {
      testOn.notExistElement({ wrapper, testId })
    })
  })

  it('Copy the value', async () => {
    const testId = 'copy-view-icon'

    mockAbilityCan.mockReturnValue(true)

    const props = createDefaultProps({
      type: ViewType.Text,
      withCopy: true,
    })

    const wrapper = getMountViewGenerator(props)

    testOn.existElement({ wrapper, testId })

    await flushPromises()

    await clickTrigger({ wrapper, testId })

    expect(copyToClipboard).toHaveBeenCalledWith(viewValue)
  })
})
