import { beforeEach, describe, it } from 'vitest'
import GroupFragmentSettingsTable from '../../../../src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { setMountComponent } from '../../utils'
import type { PermissionUpdatableTable } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'

const getMountGroupFragmentSettingsTable = setMountComponent(GroupFragmentSettingsTable)

const permissions = new AllPermission([
  { access: 4, target: 'demo-demo' },
  { access: 1, target: 'demo-demo-report' },
  { access: 3, target: 'demo-demo-seo' },
]).allPermission.demoPage

const PERMISSION_KEYS = [1, 2, 3, 4]

const defaultProps = {
  permissions,
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
})
