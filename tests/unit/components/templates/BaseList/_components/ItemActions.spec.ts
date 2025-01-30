import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ItemActions from '../../../../../../src/components/templates/BaseList/_components/fields/ItemActions.vue'
import { clickTrigger, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../src/plugins/i18n'
import { BaseListActionsSlots } from '../../../../../../src/@model/templates/baseList'
import { checkExistsPage } from '../../../../../../src/helpers'

const getMountItemActions = setMountComponent(ItemActions)
const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: vi.fn(() => ({
      push: pushMock,
    })),
  }
})

vi.mock('@/helpers', () => ({
  checkExistsPage: vi.fn(),
}))

const defaultProps = {
  item: { id: '123', name: 'Mock name' },
  createPageName: 'Create page name',
  detailsPageName: 'Details page name',
  config: {},
  canUpdate: false,
  canUpdateItem: false,
  canUpdateSeo: false,
  canCreate: false,
  getUpdateRoute: item => item,
  canRemoveItem: true,
}

let props

beforeEach(() => {
  props = defaultProps
})

const openActions = async (wrapper: VueWrapper) => {
  await clickTrigger({ wrapper, testId: 'activator' })
}

const getTestTitle = (buttonName: string) => `Render button "${buttonName}" by condition and call action with correct params`

describe('ItemActions.vue', () => {
  it('Open actions menu by trigger', async () => {
    const wrapper = getMountItemActions(props)

    testOn.notExistElement({ wrapper, testId: 'actions-list' })

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'actions-list' })
  })

  it(getTestTitle('Toggle status'), async () => {
    props = { ...props, canUpdate: true, config: { withDeactivation: true } }

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'status-toggle' })

    await clickTrigger({ wrapper, testId: 'status-toggle' })

    testOn.isCalledEmitEventValue({ wrapper }, { event: 'on-toggle-status', value: props.item })
  })

  it('Render valid text button of toggle status by field isActive', async () => {
    props = { ...props, canUpdate: true, config: { withDeactivation: true } }
    props.item.isActive = false

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    /// Status is false
    testOn.equalTextValue({ wrapper, testId: 'status-toggle-text' }, i18n.t('action.activate'))

    await wrapper.setProps({ item: { ...props.item, isActive: true } })

    /// Status is true
    testOn.equalTextValue({ wrapper, testId: 'status-toggle-text' }, i18n.t('action.deactivate'))
  })

  it(getTestTitle('Details (Card page exists)'), async () => {
    props = { ...props }
    checkExistsPage.mockReturnValue(true)

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'details' })

    await clickTrigger({ wrapper, testId: 'details' })

    expect(pushMock).toHaveBeenCalledWith({ name: props.detailsPageName, params: { id: props.item.id } })
  })

  it(getTestTitle('Details (Card page does not exists'), async () => {
    props = { ...props }
    checkExistsPage.mockReturnValue(false)

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.notExistElement({ wrapper, testId: 'details' })
  })

  it(getTestTitle('Update'), async () => {
    props = { ...props, canUpdate: true, canUpdateSeo: true, canUpdateItem: true }

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'edit' })

    await clickTrigger({ wrapper, testId: 'edit' })

    expect(pushMock).toHaveBeenCalled()
  })

  it(getTestTitle('Make a copy'), async () => {
    props = { ...props, canCreate: true, config: { createFromCopy: true } }

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'copy' })

    await clickTrigger({ wrapper, testId: 'copy' })

    expect(pushMock).toHaveBeenLastCalledWith({ name: props.createPageName, params: { id: props.item.id } })
  })

  it(getTestTitle('Remove'), async () => {
    props = { ...props, canCreate: true, config: { createFromCopy: true } }

    const wrapper = getMountItemActions(props)

    await openActions(wrapper)

    testOn.existElement({ wrapper, testId: 'remove' })

    await clickTrigger({ wrapper, testId: 'remove' })

    testOn.isCalledEmitEventValue({ wrapper }, { event: 'on-remove', value: props.item })
  })

  it('Is correct render slots with params', async () => {
    props = { ...props, canCreate: true, config: { createFromCopy: true } }

    const global = {}

    const slots = {
      [BaseListActionsSlots.PrependActionItem]: `<div data-test-id="${BaseListActionsSlots.PrependActionItem}">${props.item}</div>`,
      [BaseListActionsSlots.AppendActionItem]: `<div data-test-id="${BaseListActionsSlots.AppendActionItem}">${props.item}</div>`,
      [BaseListActionsSlots.Details]: `<div data-test-id="${BaseListActionsSlots.Details}">${props.item}</div>`,
    }

    const wrapper = getMountItemActions(props, global, slots)

    await openActions(wrapper)

    /// Check slots
    Object.values(BaseListActionsSlots).forEach((slotKey: BaseListActionsSlots) => {
      testOn.existElement({ wrapper, testId: slotKey })
      testOn.existTextValue({ wrapper, testId: slotKey }, props.item)
    })
  })
})
