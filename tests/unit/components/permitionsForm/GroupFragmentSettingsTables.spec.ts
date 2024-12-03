import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import { setMountComponent } from '../../utils'
import {
  mockPermissions,
  permissionsConfig,
} from '../../templates/shared-tests/permission-table'
import GroupFragmentSettingsTables from '../../../../src/components/permitionsForm/GroupFragmentSettingsTables.vue'

const getMountGroupFragmentSettingsTables = props => setMountComponent(GroupFragmentSettingsTables)(props, {
  stubs: {
    VExpansionPanel: { template: '<div data-test-id="explanation-panel"><slot /></div>' },
  },
})

vi.mock('@permissions', () => (mockPermissions))

const defaultProps = {
  permissions: permissionsConfig,

}

let props

describe('GroupFragmentSettings.vue', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Renders correctly base elements', () => {
    const wrapper = getMountGroupFragmentSettingsTables(props)
  })
})
