import { it, vi } from 'vitest'
import { i18n } from '../../../../src/plugins/i18n'
import { VColors } from '../../../../src/@model/vuetify'
import { testOn } from './test-case-generator'

export const mockStore = {
  getters: {
    userInfo: {
      id: '0123456789',
    },
  },
  dispatch: vi.fn(),
}

export const defaultProps = {
  item: { id: '0123456789', name: 'Detail' },
  getUpdateRoute: item => ({ name: item.name, params: { id: item.id } }),
  isShowYou: false,
}

export const testIds = {
  name: 'name',
  badgeYou: 'badge-you',
  link: 'link',
  copyField: 'copy-field',
  slotContent: 'slot-content',
}

export const checkBaseTestCaseForNameWithId = mountMethod => {
  it('Not show Link when not exist route ', async () => {
    const wrapper = mountMethod(defaultProps)

    testOn.notExistElement({ wrapper, testId: testIds.name })

    /// Reset props getUpdateRoute
    await wrapper.setProps({ getUpdateRoute: null, getDetailRoute: null })

    /// Check render content name without link
    testOn.existTextValue({ wrapper, testId: testIds.name }, defaultProps.item.name)
  })

  it('Is render content with props isShowYou', async () => {
    defaultProps.isShowYou = true

    const wrapper = mountMethod(defaultProps)

    /// When id is equal to сгккуте user id from store
    testOn.existTextValue({ wrapper, testId: testIds.badgeYou }, i18n.t('common.you'))

    /// Classes for badge
    const expectedClasses = ['v-chip--label', `text-${VColors.Info}`]

    /// Check that the badge has the necessary classes
    expectedClasses.forEach(expectedClass => {
      testOn.existClass({ wrapper, testId: testIds.badgeYou }, expectedClass)
    })

    /// Make id not equal to user id from store
    await wrapper.setProps({ item: { id: '0987654321', name: 'Detail' } })

    /// Check that the badge is not displayed
    testOn.notExistElement({ wrapper, testId: testIds.badgeYou })
  })
}
