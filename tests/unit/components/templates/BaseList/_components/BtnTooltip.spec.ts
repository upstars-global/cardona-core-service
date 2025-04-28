import { beforeEach, describe, it } from 'vitest'
import type { TranslateResult } from 'vue-i18n'
import { getSelectorTestId, setMountComponent } from '../../../../utils'
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

const defaultProps = {
  tooltipText: 'Some tooltip text',
  label: 'Some button text',
}

let props

beforeEach(() => {
  props = defaultProps
})

describe('BtnTooltip.vue', () => {
  it('Renders correctly base elements', async () => {
    const wrapper = getMountComponent(props)

    testOn.existTextValue({ wrapper, testId: 'tooltip-activator' }, props.label)

    await wrapper.find(getSelectorTestId('tooltip-activator')).trigger('mouseover')
    await wrapper.trigger('mouseover')

    console.log(wrapper.html())
  })
})
