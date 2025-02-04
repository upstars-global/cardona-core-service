import { h } from 'vue'
import { beforeEach, describe, it } from 'vitest'
import { omit } from 'lodash'
import type { VueWrapper } from '@vue/test-utils'
import BadgesField from '../../../../../../../src/components/templates/BaseList/_components/fields/BadgesField.vue'
import { getWrapperElement, setMountComponent } from '../../../../../utils'
import { IconsList } from '../../../../../../../src/@model/enums/icons'
import { VColors } from '../../../../../../../src/@model/vuetify'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountBadgesField = setMountComponent(BadgesField)

const getBadge = (index: number): {
  icon?: IconsList
  color?: VColors
  name: string
  position?: number
} => ({
  icon: IconsList.CheckIcon,
  color: VColors.Success,
  name: `Badge ${index + 1}`,
  position: index + 1,
})

const removeKeyFromCollection = item => removeKey => omit(item, removeKey)

const defaultProps = {
  listBadges: Array.from({ length: 10 }, (_, index) => getBadge(index)),
  countItemShowBadge: 5,
}

let props

describe('BadgesField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders badges that is fulling ta data', () => {
    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((badge, index) => {
      testOn.existTextValue({ wrapper, testId: `badge-${index}` }, `${badge.name}(${badge.position})`)
      testOn.existClass({ wrapper, testId: `badge-icon-${index}`, selector: 'i' }, badge.icon)
      testOn.existTextValue({ wrapper, testId: `badge-position-${index}` }, `(${badge.position})`)
    })
  })

  it('Check render badges without icon', () => {
    props.listBadges = props.listBadges.map(removeKeyFromCollection('icon'))

    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((_, index) => {
      testOn.notExistElement({ wrapper, testId: `badge-icon-${index}` })
    })
  })

  it('Check render badges without position', () => {
    props.listBadges = props.listBadges.map(removeKeyFromCollection('position'))

    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((_, index) => {
      testOn.notExistElement({ wrapper, testId: `badge-position-${index}` })
    })
  })

  it('Actual color for badge', () => {
    /// Remove color for some badges
    props.listBadges[2].color = ''
    props.listBadges[4].color = ''

    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((badge, index) => {
      const actualColorClass = `text-${badge.color || VColors.Secondary}`

      /// Check class for badge on color if color is empty then color is secondary else is color from data
      testOn.existClass({ wrapper, testId: `badge-${index}` }, actualColorClass)
    })
  })

  it ('Check render badges with countItemShowBadge', () => {
    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((badge, index) => {
      testOn.existTextValue({ wrapper, testId: `badge-${index}` }, `${badge.name}(${badge.position})`)
    })

    testOn.existTextValue({ wrapper, testId: 'badge-count' }, `+${props.listBadges.length - props.countItemShowBadge}`)
  })

  it ('When isn`t rendering of count', () => {
    props.countItemShowBadge = 10

    const wrapper = getMountBadgesField(props)

    props.listBadges.slice(0, 5).forEach((badge, index) => {
      testOn.existTextValue({ wrapper, testId: `badge-${index}` }, `${badge.name}(${badge.position})`)
    })
  })

  it ('Check data from default slot and render here contnet ', () => {
    const global = {}

    const slots = {
      default: ({ value }) => h(
        'div',
        { 'data-test-id': 'custom-slot' },
        `${JSON.stringify(value)}`,
      ),
    }

    const wrapper = getMountBadgesField(props, global, slots)

    getWrapperElement({ wrapper, testId: 'custom-slot', all: true })
      .forEach((element: VueWrapper, index: number) => {
        testOn.existTextValue({ wrapper: element }, JSON.stringify(props.listBadges[index]))
      })
  })
})
