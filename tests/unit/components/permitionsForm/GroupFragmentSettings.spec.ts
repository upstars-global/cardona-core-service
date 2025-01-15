import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import {
  mockPermissions,
  permissionsConfig,
  testIds, updateValueForPermissionInput,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettings from '../../../../src/components/permitionsForm/GroupFragmentSettings.vue'

const getMountGroupFragmentSettingsTable = props => setMountComponent(GroupFragmentSettings)(props, {
  stubs: {
    VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
  },
})

vi.mock('@permissions', () => (mockPermissions))

const defaultProps = {
  permissions: permissionsConfig,
  title: 'Access control',
  notHeader: false,
  checkedTable: false,
  disabled: false,
}

let props

describe('GroupFragmentSettings.vue', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Renders correctly base elements', () => {
    const wrapper = getMountGroupFragmentSettingsTable(props)

    testOn.equalTextValue({ wrapper, testId: 'collapse-title' }, props.title)
    testOn.existElement({ wrapper, testId: testIds.switchAll })
    testOn.existElement({ wrapper, testId: 'permission-table' })
  })
  it('Call event on change checkbox permission', async () => {
    /// Ids check box on each permission level
    const idsCheckboxes = [
      testIds.checkboxOnAccessRemove,
      testIds.checkboxOnAccessUpdate,
      testIds.checkboxOnAccessCreate,
      testIds.checkboxOnAccessView,
    ]

    const expectedValue = cloneDeep(permissionsConfig)[0]
    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// Check call event and value for each change state of checkbox
    for (const testId of idsCheckboxes) {
      const index = idsCheckboxes.indexOf(testId)

      await updateValueForPermissionInput({ wrapper, testId }, false)
      expectedValue.access -= 1
      testOn.isCalledEmitEventValue({ wrapper }, { event: 'updatePermissions', value: expectedValue, index })
    }

    /// Update value switch for all permissions
    await updateValueForPermissionInput({ wrapper, testId: testIds.switchAll }, true)

    const quantityOfChangesOfCheckbox = idsCheckboxes.length

    // Check that user will have full access in group of permission
    testOn.isCalledEmitEventValue({ wrapper }, { event: 'updatePermissions', value: permissionsConfig[0], index: quantityOfChangesOfCheckbox })
  })

  it('Call event on  change checkbox permission', async () => {
    const forAccessLevelValue = 3

    mockPermissions.default.demoPage[1].forAccessLevelValue = forAccessLevelValue
    vi.mock('@permissions', () => mockPermissions)

    const expectedValue = cloneDeep(permissionsConfig)[1]

    expectedValue.access = forAccessLevelValue

    const wrapper = getMountGroupFragmentSettingsTable(props)

    /// Remove access for permission
    await updateValueForPermissionInput({ wrapper, testId: testIds.switchTestExport }, false)

    expectedValue.access -= forAccessLevelValue

    testOn.isCalledEmitEventValue({ wrapper }, { event: 'updatePermissions', value: expectedValue })

    /// Return access for permission

    await updateValueForPermissionInput({ wrapper, testId: testIds.switchTestExport }, true)

    expectedValue.access += forAccessLevelValue

    testOn.isCalledEmitEventValue({ wrapper }, { event: 'updatePermissions', value: expectedValue, index: 1 })
  })
})
