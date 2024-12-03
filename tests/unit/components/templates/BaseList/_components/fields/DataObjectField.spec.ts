import { beforeEach, describe, it } from 'vitest'
import DataObjectField from '../../../../../../../src/components/templates/BaseList/_components/fields/DataObjectField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../../src/plugins/i18n'

const getMountDataObjectField = setMountComponent(DataObjectField)

const defaultProps = {
  data: {
    name: 'John Doe',
    age: '18',
    email: 'test@test.com',
    position: 'Developer',
    experience: '',
  },
}

let props

describe('DataObjectField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly object key and value', () => {
    const wrapper = getMountDataObjectField(props)

    Object.keys(props.data).forEach(key => {
      testOn.equalTextValue({ wrapper, testId: `key-${key}` }, `${key}:`)

      const expectedTextValue = props.data[key] || String(i18n.t('common.empty')).toLowerCase()
      if (props.data[key])

        /// Exist value of data
        testOn.equalTextValue({ wrapper, testId: `value-${key}` }, expectedTextValue)
      else

        /// Empty value of data
        testOn.equalTextValue({ wrapper, testId: `empty-value-${key}` }, String(i18n.t('common.empty')).toLowerCase())
    })
  })
})
