import { beforeEach, describe, it } from 'vitest'
import GroupFragmentSettingsTable from '../../../../src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { setMountComponent } from '../../utils'

const getMountGroupFragmentSettingsTable = setMountComponent(GroupFragmentSettingsTable)

const defaultProps = {
  permissions: [
    { access: 4, target: 'demo-demo' },
    { access: 3, target: 'demo-demo-seo' },
  ],
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
    const wrapper = getMountGroupFragmentSettingsTable(props)

    console.log(wrapper.html)
  })
})
