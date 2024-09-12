import { describe, expect, it } from 'vitest'
import StatementField from '../../../../src/components/templates/_components/StatementField.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { VColors } from '../../../../src/@model/vuetify'
import {t} from "../shared-tests/locales";

const getMountStatementField = setMountComponent(StatementField)

describe('StatementField', () => {
  it('Renders correctly when state is true', async () => {
    const wrapper = getMountStatementField({ state: true })

    const badge = wrapper.find(getSelectorTestId('statement-badge'))

    expect(wrapper.vm.badgeVariant).toBe(VColors.Success)
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe(t('common.yes'))
    expect(badge.classes()).includes('text-success')
  })
  it('Renders correctly when state is false', async () => {
    const wrapper = getMountStatementField({ state: false })

    const badge = wrapper.find(getSelectorTestId('statement-badge'))

    expect(wrapper.vm.badgeVariant).toBe(VColors.Error)
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe(t('common.no'))
    expect(badge.classes()).includes('text-error')
  })
})
