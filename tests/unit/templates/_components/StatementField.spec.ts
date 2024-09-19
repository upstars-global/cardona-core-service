import { describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import StatementField from '../../../../src/components/templates/_components/StatementField.vue'
import {
  setMountComponent, testOnEqualTextValue,
  testOnExistClass, testOnExistElement,
} from '../../utils'
import { VColors } from '../../../../src/@model/vuetify'
import { t } from '../shared-tests/locales'

const getMountStatementField = setMountComponent(StatementField)

const getCurrentElement = (wrapper: VueWrapper) => ({ wrapper, testId: 'statement-badge' })

describe('StatementField', () => {
  const runTest = async (state: boolean, expectedText: string, expectedClass: string) => {
    const wrapper = getMountStatementField({ state })
    const currentElement = getCurrentElement(wrapper)

    testOnExistElement(currentElement)
    testOnEqualTextValue(currentElement, expectedText)
    testOnExistClass(currentElement, expectedClass)
  }

  it('Renders correctly when state is true', async () => {
    await runTest(true, t('common.yes'), `text-${VColors.Success}`)
  })

  it('Renders correctly when state is false', async () => {
    await runTest(false, t('common.no'), `text-${VColors.Error}`)
  })
})
