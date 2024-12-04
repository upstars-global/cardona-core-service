import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import {
  PERMISSION_KEYS, mockPermissions, permissionsConfig, switchAllIsDisabled, updateValueForPermissionInput,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettingsTables from '../../../../src/components/permitionsForm/GroupFragmentSettingsTables.vue'
import type { PermissionInput, PermissionUpdatableTable } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'
import { testOn } from '../../templates/shared-tests/test-case-generator'

const getMountGroupFragmentSettingsTables = props => setMountComponent(GroupFragmentSettingsTables)(props, {
  stubs: {
    VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
  },
})

vi.mock('@permissions', () => (mockPermissions))

const getPermissionsProps = (data: Array<PermissionInput>) => new AllPermission(data).allPermission

const defaultProps = {
  title: 'Access control',
  tables: [
    {
      title: 'Group-1',
      permissions: getPermissionsProps(permissionsConfig).group1,
    },
    {
      title: 'Group-2',
      permissions: getPermissionsProps(permissionsConfig).group2,
    },
    {
      title: 'Group-3',
      permissions: getPermissionsProps(permissionsConfig).group3,
    },
  ],
  disabled: false,
}

let props

describe('GroupFragmentSettings.vue', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Renders correctly base elements by props', () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)

    props.tables.forEach(table => {
      table.permissions.filter(i => i.type === 'table').forEach((permission: PermissionUpdatableTable) => {
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
  })

  it('Call event on change', async () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)

    /// Reset permission value
    await updateValueForPermissionInput({ wrapper, testId: 'permission-checkbox-test-group-1-1' }, false)

    /// Check that event is called
    testOn.isCalledEmitEventValue(wrapper, { event: 'change', value: [] })

    /// Set permission value for all group
    await updateValueForPermissionInput({ wrapper, testId: 'switch-all' }, true)

    /// Check that event is called
    testOn.isCalledEmitEventValue(wrapper, { event: 'change', value: [], index: 1 })

    /// Is disabled switch all
    switchAllIsDisabled(wrapper)
  })
})
