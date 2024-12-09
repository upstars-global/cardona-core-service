import StatusField from '../../../../src/components/templates/_components/StatusField.vue'
import {
  setMountComponent,
} from '../../utils'

import { runTestCaseForStatusField } from '../shared-tests/status-field'

const getMountStatusField = setMountComponent(StatusField)

runTestCaseForStatusField('StatusField.vue', getMountStatusField)
