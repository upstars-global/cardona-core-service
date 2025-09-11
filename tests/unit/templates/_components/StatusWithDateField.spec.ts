import { describe, it } from 'vitest'

import StatusWithDateField from '../../../../src/components/templates/_components/StatusWithDateField.vue'

import {
  getComponentFromWrapper,
  setMountComponent,
} from '../../utils'

import { fullDate } from '../../../../src/utils/date'
import { testingDate } from '../shared-tests/date-and-dateTimeField'
import { testOn } from '../shared-tests/test-case-generator'
import { MockStatusVariants } from '../shared-tests/status-field'
import { StatusWithVariant } from '../../../../src/@model/view'

const getMountStatusWithDateField = setMountComponent(StatusWithDateField)

const statusKeys = Object.keys(MockStatusVariants) as Array<keyof typeof MockStatusVariants>

describe('StatusWithDateField', () => {
  it(`Renders correctly color for status ${statusKeys[0]} and date`, () => {
    const wrapper = getMountStatusWithDateField({
      item: {
        status: new StatusWithVariant(statusKeys[0], MockStatusVariants[statusKeys[0]]),
        updatedAt: new Date(testingDate),
      },
    })

    testOn.existClass({
      wrapper: getComponentFromWrapper(wrapper, 'StatusField'),
    }, `text-${MockStatusVariants[statusKeys[0]]}`)

    testOn.equalTextValue({
      wrapper: getComponentFromWrapper(wrapper, 'DateField'),
    }, fullDate(new Date(testingDate)))
  })
})
