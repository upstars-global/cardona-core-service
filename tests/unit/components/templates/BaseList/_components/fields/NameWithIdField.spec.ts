import { beforeEach, describe, it, vi } from 'vitest'
import NameWithIdField from '../../../../../../../src/components/templates/BaseList/_components/fields/NameWithIdField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../../src/plugins/i18n'
import { getShortString } from '../../../../../../../src/helpers'
import { VColors } from '../../../../../../../src/@model/vuetify'

const getMountNameWithIdField = setMountComponent(NameWithIdField)

const mockStore = {
  getters: {
    userInfo: {
      id: '0123456789',
    },
  },
  dispatch: vi.fn(),
}

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => mockStore,
  }
})

const defaultProps = {
  item: { id: '0123456789', name: 'Detail' },
  getUpdateRoute: item => ({ name: item.name, params: { id: item.id } }),
  isShowYou: false,
  isShort: false,
}

let props

describe('NameWithField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders content in default state', () => {
    const wrapper = getMountNameWithIdField(props)

    testOn.existTextValue({ wrapper, testId: 'link' }, props.item.name)
    testOn.existTextValue({ wrapper, testId: 'copy-field' }, props.item.id.toString())
  })

  it('Not show Link when not exist route ', async () => {
    const wrapper = getMountNameWithIdField(props)

    testOn.notExistElement({ wrapper, testId: 'name' })

    /// Reset props getUpdateRoute
    await wrapper.setProps({ getUpdateRoute: null })

    /// Check render content name without link
    testOn.existTextValue({ wrapper, testId: 'name' }, props.item.name)
  })

  it('Is render content with props isShowYou', async () => {
    props.isShowYou = true

    const wrapper = getMountNameWithIdField(props)

    /// When id is equal to сгккуте user id from store
    testOn.existTextValue({ wrapper, testId: 'badge-you' }, i18n.t('common.you'))

    /// Classes for badge
    const expectedClasses = ['v-chip--label', `text-${VColors.Info}`]

    /// Check that the badge has the necessary classes
    expectedClasses.forEach(expectedClass => {
      testOn.existClass({ wrapper, testId: 'badge-you' }, expectedClass)
    })

    /// Make id not equal to user id from store
    await wrapper.setProps({ item: { id: '0987654321', name: 'Detail' } })

    /// Check that the badge is not displayed
    testOn.notExistElement({ wrapper, testId: 'badge-you' })
  })

  it('Is render component with short if', async () => {
    props.isShort = true

    const wrapper = getMountNameWithIdField(props)

    testOn.existTextValue({ wrapper, testId: 'copy-field' }, getShortString(props.item.id))
  })

  it('Correct render slot content ', () => {
    const slotText = 'Slot content'

    const slot = {
      default: `<div data-test-id="slot-content">${slotText}</div>`,
    }

    const global = {}

    const wrapper = getMountNameWithIdField(props, global, slot)

    testOn.existTextValue({ wrapper, testId: 'slot-content' }, slotText)
    testOn.existTextValue({ wrapper, testId: 'copy-field' }, props.item.id.toString())
  })
})
