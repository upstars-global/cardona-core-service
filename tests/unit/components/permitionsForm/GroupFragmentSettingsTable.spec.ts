import { beforeEach, describe, it, vi } from 'vitest'
import GroupFragmentSettingsTable from '../../../../src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { getSelectorTestId, getWrapperElement, setMountComponent, setValue } from '../../utils'
import type { PermissionInput, PermissionUpdatableTable } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'

const getMountGroupFragmentSettingsTable = setMountComponent(GroupFragmentSettingsTable)

const permissionsConfig: Array<PermissionInput> = [
  { access: 4, target: 'test' },
  { access: 1, target: 'test-export' },
  { access: 3, target: 'test-seo' },
]

const getPermissionsProps = (data: Array<PermissionInput>) => new AllPermission(data).allPermission.demoPage

vi.mock('@permissions', () => ({
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
    ] as PermissionUpdatableTable[],
  },
}))

const PERMISSION_KEYS = [1, 2, 3, 4]

const defaultProps = {
  permissions: getPermissionsProps(permissionsConfig),
  title: 'Access control',
  notHeader: false,
  checkedTable: false,
  disabled: false,
}

let props

describe('GroupFragmentSettingsTable.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props, {
      stubs: {
        VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
      },
    })

    testOn.equalTextValue({ wrapper, testId: 'collapse-title' }, props.title)
    testOn.existElement({ wrapper, testId: 'switch-all' })
    testOn.existElement({ wrapper, testId: 'permission-table' })
  })

  it('Renders in table checkboxes or temp by permission', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props, {
      stubs: {
        VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
      },
    })

    props.permissions.filter(i => i.type === 'table').forEach((permission: PermissionUpdatableTable) => {
      PERMISSION_KEYS.forEach(key => {
        const existCheckBox = !permission.notAccessLevel?.includes(Number(key))

        const testId = existCheckBox
          ? `permission-checkbox-${permission.target}-${key}`
          : `empty-${permission.target}-${key}`

        testOn.existElement({
          wrapper,
          testId,
        })
      })
    })
  })

  it('Renders switch of permission', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props, {
      stubs: {
        VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
      },
    })

    const switchOfPermission = props.permissions.filter(i => i.type === 'switch')

    switchOfPermission.forEach(permission => {
      testOn.equalTextValue({ wrapper, testId: `permission-switch-${permission.target}` }, i18n.t(`permission.${permission.target}`))
    })
  })

  it('Switch all is disabled by condition', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props, {
      stubs: {
        VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
      },
    })

    /// All permissions are checked
    testOn.existClass({ wrapper, testId: 'switch-all' }, 'v-input--disabled')

    /// Uncheck some check checkbox
    const checkboxWrapper = getWrapperElement({ wrapper, selector: `${getSelectorTestId('permission-checkbox-test-1')} input` })

    await setValue(checkboxWrapper, false)

    /// Check that switch all is not disabled
    testOn.notExistClasses({ wrapper, testId: 'switch-all' }, 'v-input--disabled')
  })
})
