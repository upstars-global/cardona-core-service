import { describe, expect, it } from 'vitest'

import StatusWithDateField from '../../../../src/components/templates/_components/StatusWithDateField.vue'
import { getComponentFromWrapper, setMountComponent } from '../../utils'

import { StatusVariants } from '../../../../src/@model/enums/statusField'
import { fullDate } from '../../../../src/utils/date'
import { testingDate } from '../shared-tests/date-and-dateTimeField'

const getMountStatusWithDateField = setMountComponent(StatusWithDateField)

const statusKeys = Object.keys(StatusVariants) as Array<keyof typeof StatusVariants>

describe('StatusWithDateField', () => {
  it(`Renders correctly color for status ${statusKeys[0]} and date`, () => {
    const wrapper = getMountStatusWithDateField({
      item: {
        status: statusKeys[0],
        updatedAt: new Date(testingDate),
      },
    })

    expect(getComponentFromWrapper(wrapper, 'StatusField').findComponent({ name: 'VChip' }).classes())
      .includes(`text-${StatusVariants[statusKeys[0]]}`)

    expect(getComponentFromWrapper(wrapper, 'DateField').text())
      .toBe(fullDate(new Date(testingDate)))
  })
})
