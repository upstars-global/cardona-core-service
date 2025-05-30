import { beforeEach, describe, expect, it, vi } from 'vitest'
import NameWithIdField from '../../../../../../../src/components/templates/BaseList/_components/fields/NameWithIdField.vue'
import { setMountComponent } from '../../../../../utils'
import {
  checkBaseTestCaseForNameWithId,
  global,
  defaultProps,
  mockStore,
  testIds,
} from '../../../../../templates/shared-tests/name-with-short-id'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { getShortString } from '../../../../../../../src/helpers'

const getMountNameWithIdField = setMountComponent(NameWithIdField)

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => mockStore,
  }
})

let props

describe('NameWithField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  checkBaseTestCaseForNameWithId(getMountNameWithIdField)

  it('Renders content in default state', () => {
    const wrapper = getMountNameWithIdField(props, global)

    testOn.existTextValue({ wrapper, testId: testIds.link }, props.item.name)
    testOn.existTextValue({ wrapper, testId: testIds.copyField }, props.item.id.toString())
  })

  it('Is render component with short if', async () => {
    props.isShort = true

    const wrapper = getMountNameWithIdField(props, global)

    testOn.existTextValue({ wrapper, testId: testIds.copyField }, getShortString(props.item.id))
  })

  it('Correct render slot content ', () => {
    const slotText = 'Slot content'

    const slot = {
      default: `<div data-test-id="slot-content">${slotText}</div>`,
    }

    const wrapper = getMountNameWithIdField(props, global, slot)

    testOn.existTextValue({ wrapper, testId: testIds.slotContent }, slotText)
    testOn.existTextValue({ wrapper, testId: testIds.copyField }, props.item.id.toString())
  })

  it('Returns details route if available', () => {
    const testProps = {
      ...props,
      getDetailsRoute: item => ({
        name: `${item.name}Card`,
        params: { id: item.id },
        path: `/card/${item.id}`,
      }),
    }

    const wrapper = getMountNameWithIdField(testProps, global)

    expect(wrapper.vm.routePath).toEqual(testProps.getDetailsRoute(testProps.item))
  })

  it('Returns update route if details route is missing', () => {
    const testProps = {
      ...props,
      getDetailsRoute: undefined,
      getUpdateRoute: item => ({
        name: `${item.name}Update`,
        params: { id: item.id },
        path: `/update/${item.id}`,
      }),
    }

    const wrapper = getMountNameWithIdField(testProps, global)

    expect(wrapper.vm.routePath).toEqual(testProps.getUpdateRoute(testProps.item))
  })

  it('Returns null if both routes are missing', () => {
    const testProps = {
      ...props,
      getDetailsRoute: undefined,
      getUpdateRoute: undefined,
    }

    const wrapper = getMountNameWithIdField(testProps, global)

    expect(wrapper.vm.routePath).toEqual({})
  })
})
