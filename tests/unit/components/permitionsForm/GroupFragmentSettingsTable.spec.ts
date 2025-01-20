import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import GroupFragmentSettingsTable from '../../../../src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { setMountComponent } from '../../utils'
import type { PermissionInput, PermissionUpdatableTable } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'
import {
  checkExistPermissionCheckbox,
  permissionsConfig, switchAllIsDisabled,
  switchAllNotDisabled, testCheckboxDisabledState, testIds, updateValueForPermissionInput,
} from '../../templates/shared-tests/permission-table'

const getMountGroupFragmentSettingsTable = props => setMountComponent(GroupFragmentSettingsTable)(props, {
  stubs: {
    VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
  },
})

const getPermissionsProps = (data: Array<PermissionInput>) => new AllPermission(data).allPermission.test

vi.mock('@permissions', () => ({
  default: {
    test: [
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
    props = cloneDeep(defaultProps)
  })

  it('Renders correctly base elements', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    testOn.equalTextValue({ wrapper, testId: 'collapse-title' }, props.title)
    testOn.existElement({ wrapper, testId: testIds.switchAll })
    testOn.existElement({ wrapper, testId: 'permission-table' })
  })

  it('Check component render on disabled state', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// Check that all checkboxes are disabled
    testCheckboxDisabledState(wrapper, { permissions: props.permissions, isDisabled: false })

    await wrapper.setProps({ disabled: true })

    switchAllIsDisabled(wrapper)

    /// Check that all checkboxes are disabled
    testCheckboxDisabledState(wrapper, { permissions: props.permissions, isDisabled: true })
  })

  it('Renders in table checkboxes or temp by permission', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    checkExistPermissionCheckbox(wrapper, props.permissions)
  })

  it('Renders switch of permission', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    const switchOfPermission = props.permissions.filter(i => i.type === 'switch')

    switchOfPermission.forEach(permission => {
      testOn.equalTextValue({ wrapper, testId: `permission-switch-${permission.target}` }, i18n.t(`permission.${permission.target}`))
    })
  })

  it('Switch all is disabled by checked checkbox', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// All permissions are checked
    switchAllIsDisabled(wrapper)

    await updateValueForPermissionInput({ wrapper, testId: 'permission-checkbox-test-1' }, false)

    /// Check that switch all is not disabled
    switchAllNotDisabled(wrapper)
  })

  it('Switch all is disabled by switch', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    switchAllIsDisabled(wrapper)

    await updateValueForPermissionInput({ wrapper, testId: testIds.switchTestExport }, false)

    switchAllNotDisabled(wrapper)
  })

  it('Switch all is disabled after set value true', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// Check base state
    switchAllIsDisabled(wrapper)

    /// Make switch all unchecked
    await updateValueForPermissionInput({ wrapper, testId: testIds.switchTestExport }, false)

    /// Check that switch all is disabled
    switchAllNotDisabled(wrapper)

    /// Make switch all checked

    await updateValueForPermissionInput({ wrapper, testId: testIds.switchAll }, true)

    /// Check that switch all is disabled
    switchAllIsDisabled(wrapper)
  })

  it('Call event on set value permission checkbox', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// Initial state has checked all
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'updateAllChecked', value: true })

    /// Uncheck one of the checkboxes
    await updateValueForPermissionInput({ wrapper, testId: testIds.checkboxOnAccessRemove }, false)

    /// Check that the event is called with the value false
    testOn.isCalledEmitEvent({ wrapper }, 'change')

    /// Check that the event is called with the value false because one of the checkboxes is unchecked
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'updateAllChecked', value: false, index: 1 })

    /// Make unchecked checkbox checked
    await updateValueForPermissionInput({ wrapper, testId: testIds.checkboxOnAccessRemove }, true)

    /// Check that the event is called
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'change', value: undefined, index: 2 })

    /// Check that the event is called with the value true because all checkboxes are checked
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'updateAllChecked', value: true, index: 2 })
  })
})
