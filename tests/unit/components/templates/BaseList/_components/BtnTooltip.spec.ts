import { beforeEach, describe, expect, it } from 'vitest'
import type { TranslateResult } from 'vue-i18n'
import { clickTrigger, setMountComponent } from '../../../../utils'
import BtnTooltip from '../../../../../../src/components/templates/_components/BtnTooltip.vue'
import type { VColors, VSizes, VVariants } from '../../../../../../src/@model/vuetify'
import type { IconsList } from '../../../../../../src/@model/enums/icons'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'

const getMountComponent = setMountComponent(BtnTooltip)

interface BtnTooltipProps {
  tooltipText: TranslateResult
  location?: string
  size?: VSizes | string | number
  color?: VColors
  variant?: VVariants
  appendIcon?: IconsList
  prependIcon?: IconsList
  disabled?: boolean
  label?: string
}

const defaultProps: BtnTooltipProps = {
  tooltipText: 'Some tooltip text',
  label: 'Some button text',
}

let props

beforeEach(() => {
  props = defaultProps
})

describe('BtnTooltip.vue', () => {
  it('Renders correctly content text of component', () => {
    const wrapper = getMountComponent(props)

    testOn.existTextValue({ wrapper, testId: 'tooltip-activator' }, props.label)
    testOn.existTextValue({ wrapper, selector: '.v-overlay__content' }, props.tooltipText)
  })

  it('Check call event "click"', async () => {
    const wrapper = getMountComponent(props)

    await clickTrigger({ wrapper, testId: 'tooltip-activator' })

    testOn.isCalledEmitEvent({ wrapper }, 'click')
  })

  it('Check render  default slot content ', () => {
    const SLOT_TEXT = 'Slot content'
    const wrapper = getMountComponent(props, {}, { default: `<div data-test-id="slot-content">${SLOT_TEXT}</div>` })

    testOn.existTextValue({ wrapper, testId: 'slot-content' }, SLOT_TEXT)
  })

  it('Check not calling event "click" on disabled state', async () => {
    const wrapper = getMountComponent({ ...props, disabled: true })

    await clickTrigger({ wrapper, testId: 'tooltip-activator' })

    expect(wrapper.emitted()).toStrictEqual({})
  })
})
