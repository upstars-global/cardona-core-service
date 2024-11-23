import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ExportFormatSelector from '../../../../../../src/components/templates/BaseList/_components/ExportFormatSelector.vue'
import { clickTrigger, getWrapperElement, setMountComponent } from '../../../../utils'
import { ExportFormat } from '../../../../../../src/@model/templates/baseList'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../src/@model/enums/icons'
import { i18n } from '../../../../../../src/plugins/i18n'
import { VColors, VVariants } from '../../../../../../src/@model/vuetify'

const getMountExportFormatSelector = setMountComponent(ExportFormatSelector)

const defaultProps = {
  disabled: false,
  formatOfExports: [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.XLSX],
}

let props

beforeEach(() => {
  props = defaultProps
})

describe('ExportButton.vue', () => {
  it('Renders correctly base elements', async () => {
    const wrapper = getMountExportFormatSelector(props)

    const menuActivator: { wrapper: VueWrapper } = { wrapper: getWrapperElement({ wrapper, selector: 'button' }) }

    await clickTrigger(menuActivator)

    testOn.existClass({ ...menuActivator, selector: 'i' }, IconsList.UploadIcon)
    testOn.existClass(menuActivator, `text-${VColors.Secondary}`)
    testOn.existClass(menuActivator, `v-btn--variant-${VVariants.Outlined}`)
    testOn.existTextValue(menuActivator, i18n.t('action.export'))
  })

  it('Renders correctly with multiple export formats', async () => {
    const wrapper = getMountExportFormatSelector(props)

    await clickTrigger({ wrapper, testId: 'menu-activator' })

    props.formatOfExports.forEach(format => {
      testOn.existTextValue({ wrapper, testId: `export-${format}` }, format.toUpperCase())
    })
  })

  it('Renders correctly with one export format', async () => {
    props.formatOfExports = [ExportFormat.XLSX]

    const wrapper = getMountExportFormatSelector(props)

    await clickTrigger({ wrapper, testId: 'menu-activator' })

    testOn.isCalledEmitEvent(wrapper, 'exportFormatSelected')
    testOn.isCalledEmitEventValue(wrapper, { event: 'exportFormatSelected', value: ExportFormat.XLSX })
  })
})
