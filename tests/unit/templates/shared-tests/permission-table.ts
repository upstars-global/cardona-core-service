import type { VueWrapper } from '@vue/test-utils'
import { getSelectorTestId, setValue } from '../../utils'
import type { PermissionInput } from '../../../../src/@model/permission'
import { testOn } from './test-case-generator'

export const testIds = {
  switchAll: 'switch-all',
  switchTestExport: 'permission-switch-test-export',
  checkboxOnAccessRemove: 'permission-checkbox-test-4',
  checkboxOnAccessUpdate: 'permission-checkbox-test-3',
  checkboxOnAccessCreate: 'permission-checkbox-test-2',
  checkboxOnAccessView: 'permission-checkbox-test-1',
}

export const switchAllIsDisabled = (wrapper: VueWrapper) => {
  testOn.existClass({ wrapper, testId: testIds.switchAll }, 'v-input--disabled')
}

export const switchAllNotDisabled = (wrapper: VueWrapper) => {
  testOn.notExistClasses({ wrapper, testId: testIds.switchAll }, 'v-input--disabled')
}

export const updateValueForPermissionInput = async ({ wrapper, testId }: { wrapper: VueWrapper; testId: string }, value: boolean) => {
  const wrapperElement = wrapper.find(`${getSelectorTestId(testId)} input`)

  await setValue(wrapperElement, value)
}

export const PERMISSION_KEYS = [1, 2, 3, 4]
export const permissionsConfig: Array<PermissionInput> = [
  { access: 4, target: 'test' },
  { access: 1, target: 'test-export' },
  { access: 3, target: 'test-seo' },
]
