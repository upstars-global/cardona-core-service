import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import {
  checkExistPermissionCheckbox,
  mockPermissions,
  permissionsConfig,
  switchAllIsDisabled, testCheckboxDisabledState,
  updateValueForPermissionInput,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettingsTables from '../../../../src/components/permitionsForm/GroupFragmentSettingsTables.vue'
import type { PermissionInput } from '../../../../src/@model/permission'
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

  it('Renders correctly base elements', async () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)

    testOn.equalTextValue({ wrapper, testId: 'permission-group-title' }, props.title)

    props.tables.forEach(table => {
      testCheckboxDisabledState(wrapper, { permissions: table.permissions, isDisabled: false })
    })

    await wrapper.setProps({
      disabled: true,
    })

    props.tables.forEach(table => {
      testCheckboxDisabledState(wrapper, { permissions: table.permissions, isDisabled: true })
    })
  })

  it('Renders correctly permission group checkboxes', () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)

    props.tables.forEach(table => {
      checkExistPermissionCheckbox(wrapper, table.permissions)
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
