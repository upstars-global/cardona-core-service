import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import {
  mockPermissions, permissionsConfig,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettingsTables from '../../../../src/components/permitionsForm/GroupFragmentSettingsTables.vue'
import type { PermissionInput } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'

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

  it('Renders correctly base elements', () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)

    console.log(wrapper.html())
  })
})
