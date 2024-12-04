import type { VueWrapper } from '@vue/test-utils'
import { getSelectorTestId, setValue } from '../../utils'
import type { PermissionInput, PermissionUpdatableTable } from '../../../../src/@model/permission'
import { testOn } from './test-case-generator'

export const testIds = {
  switchAll: 'switch-all',
  switchTestExport: 'permission-switch-test-export',
  checkboxOnAccessRemove: 'permission-checkbox-test-4',
  checkboxOnAccessUpdate: 'permission-checkbox-test-3',
  checkboxOnAccessCreate: 'permission-checkbox-test-2',
  checkboxOnAccessView: 'permission-checkbox-test-1',
}

const basePermissionConfig = [
  { access: 4, target: 'test' },
  { access: 1, target: 'test-export' },
  { access: 3, target: 'test-seo' },
]

const permissionsGroupConfig = Array.from({ length: 3 }, (_, key) => (basePermissionConfig.map(item => ({
  ...item,
  target: `${item.target}-group-${key + 1}`,
}))))

export const PERMISSION_KEYS = [1, 2, 3, 4]

export const permissionsConfig: Array<PermissionInput> = [
  ...basePermissionConfig,
  ...permissionsGroupConfig.flat(1),
]

const getMockPermissionGroup = items => items.map(item => ({
  target: item.target,
  type: item.target.includes('export') ? 'switch' : 'table',
}))

export const mockPermissions = {
  default: {
    demoPage: [
      {
        type: 'table',
        target: 'test',
      },
      {
        type: 'switch',
        target: 'test-export',
      },
      {
        type: 'table',
        target: 'test-seo',
        notAccessLevel: [4],
      },
    ],
    group1: getMockPermissionGroup(permissionsGroupConfig[0]),
    group2: getMockPermissionGroup(permissionsGroupConfig[1]),
    group3: getMockPermissionGroup(permissionsGroupConfig[2]),
  },
}

export const elementIsDisabled = (wrapper: VueWrapper, testId: string) => {
  testOn.existClass({ wrapper, testId }, 'v-input--disabled')
}

export const elementNotDisabled = (wrapper: VueWrapper, testId: string) => {
  testOn.notExistClasses({ wrapper, testId }, 'v-input--disabled')
}

export const switchAllIsDisabled = (wrapper: VueWrapper) => elementIsDisabled(wrapper, testIds.switchAll)

export const switchAllNotDisabled = (wrapper: VueWrapper) => elementNotDisabled(wrapper, testIds.switchAll)

export const updateValueForPermissionInput = async ({ wrapper, testId }: { wrapper: VueWrapper; testId: string }, value: boolean) => {
  const wrapperElement = wrapper.find(`${getSelectorTestId(testId)} input`)

  await setValue(wrapperElement, value)
}

export const runTestForPermissionLevelItem = (permissions, action: CallableFunction) => {
  permissions.filter(i => i.type === 'table').forEach((permission: PermissionUpdatableTable) => {
    PERMISSION_KEYS.forEach(key => {
      action(permission, key)
    })
  })
}

export const checkExistPermissionCheckbox = (wrapper: VueWrapper, permissions) => {
  runTestForPermissionLevelItem(permissions, (permission, key) => {
    const existCheckBox = !permission.notAccessLevel?.includes(Number(key))

    const testId = existCheckBox
      ? `permission-checkbox-${permission.target}-${key}`
      : `empty-${permission.target}-${key}`

    testOn.existElement({
      wrapper,
      testId,
    })
  })
}
