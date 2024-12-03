import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import type { PermissionInput, PermissionUpdatableTable } from '../../../../src/@model/permission'
import { AllPermission } from '../../../../src/@model/permission'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import {
  permissionsConfig,
  testIds, updateValueForPermissionInput,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettings from '../../../../src/components/permitionsForm/GroupFragmentSettings.vue'

const getMountGroupFragmentSettingsTable = props => setMountComponent(GroupFragmentSettings)(props, {
  stubs: {
    VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
  },
})

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

const defaultProps = {
  permissions: permissionsConfig,
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
  it('Call event on on change checkbox permission', async () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    await updateValueForPermissionInput({ wrapper, testId: testIds.checkboxOnAccessRemove }, false)

    const expectedValue = cloneDeep(permissionsConfig)[0]

    expectedValue.access = 3

    testOn.isCalledEmitEventValue(wrapper, { event: 'updatePermissions', value: expectedValue, index: 0 })
  })
})
