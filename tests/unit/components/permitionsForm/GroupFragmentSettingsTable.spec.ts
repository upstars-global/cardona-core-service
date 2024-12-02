import { beforeEach, describe, it } from 'vitest'
import GroupFragmentSettingsTable from '../../../../src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { setMountComponent } from '../../utils'
import { AllPermission } from '../../../../src/@model/permission'

const getMountGroupFragmentSettingsTable = setMountComponent(GroupFragmentSettingsTable)

const permissions = new AllPermission([
  { access: 4, target: 'demo-demo' },
  { access: 1, target: 'demo-demo-report' },
  { access: 3, target: 'demo-demo-seo' },
]).allPermission.demoPage

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

    console.log(wrapper.find('.test2').html())
  })
})
