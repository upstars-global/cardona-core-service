import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import {
  PERMISSION_KEYS, mockPermissions, permissionsConfig,
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
})
