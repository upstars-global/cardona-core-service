import StatusField from '../../../../../../../src/components/templates/BaseList/_components/fields/StatusField.vue'
import { setMountComponent } from '../../../../../utils'
import { runTestCaseForStatusField } from '../../../../../templates/shared-tests/status-field'

const getMountStatusField = setMountComponent(StatusField)

runTestCaseForStatusField('StatusField.vue', getMountStatusField)
