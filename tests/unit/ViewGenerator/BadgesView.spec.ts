import { describe, it } from 'vitest'
import { testOn } from '../../unit/templates/shared-tests/test-case-generator'
import BadgesView from '../../../src/components/templates/ViewGenerator/_components/BadgesView.vue'
import { IconsList } from '../../../src/@model/enums/icons'
import { MAX_SHOW_ITEMS_BADGES_VIEW } from '../../../src/utils/constants'
import { t } from '../templates/shared-tests/locales'
import {getWrapperElement, setMountComponent} from '../utils'

const mockViewInfo = {
  withSearch: true,
  value: Array
    .from({ length: 12 })
    .fill({}).map((_, index) => ({ name: `Item ${index}` })),
  icon: IconsList.SearchIcon,
}

const getMountBadgeCopy = setMountComponent(BadgesView)
const baseWrapper = getMountBadgeCopy({ item: mockViewInfo })

describe('BadgesView', () => {
  it('Render the search field when "withSearch" is true', () => {

    testOn.existElement({ wrapper: baseWrapper, testId: 'input-field' })
  })

  it('Does not display the search field when "withSearch" is false', () => {
    const wrapper = getMountBadgeCopy({ item: { ...mockViewInfo, withSearch: false } })

    testOn.notExistElement({ wrapper, testId: 'input-field' })
  })

  it('Filters items based on the search input value', async () => {
    const wrapper = getMountBadgeCopy({ item: mockViewInfo })

    const inputSearchValue = mockViewInfo.value[0].name
    const inputField = wrapper.find('input')

    await inputField.setValue(inputSearchValue)

    testOn.existTextValue({ wrapper, testId: 'chip-list' }, inputSearchValue)
    testOn.notExistTextValue({ wrapper, testId: 'chip-list' }, mockViewInfo.value[1].name)
  })

  it('Render the correct number of list items', () => {
    const wrapper = getMountBadgeCopy({ item: mockViewInfo })

    testOn.checkLengthElements({ wrapper, testId: 'chip-label', all: true }, MAX_SHOW_ITEMS_BADGES_VIEW)
  })

  it('Render the "Show more" button when there are more than 10 items', () => {
    testOn.existTextValue({ wrapper: baseWrapper, testId: 'chip-list' }, t('common.showMore'))
  })

  it('Render the "Show less" button when the list is expanded', async () => {
    const wrapper = getMountBadgeCopy({ item: mockViewInfo })

    const toggleButton = getWrapperElement({ wrapper, testId: 'show-more' })

    await toggleButton.trigger('click')

    testOn.existTextValue({ wrapper, testId: 'chip-list' }, t('common.showLess'))
  })
})
