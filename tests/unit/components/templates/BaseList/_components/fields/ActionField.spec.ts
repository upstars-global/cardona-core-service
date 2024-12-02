import { describe, it } from 'vitest'
import ActionField from '../../../../../../../src/components/templates/BaseList/_components/fields/ActionField.vue'
import { setMountComponent } from '../../../../../utils'
import { ActionType, ActionVariant } from '../../../../../../../src/@model/enums/action'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../../src/plugins/i18n'

const getMountActionField = setMountComponent(ActionField)

const checkActionNameWithColor = (actionType: ActionType) => {
  const variant = ActionVariant[actionType]
  const text = i18n.t(`action.${actionType}`)

  it(`Action\n\t type: ${actionType} \n\t variant: ${variant}  \n\t text: ${text}`, () => {
    const wrapper = getMountActionField({ type: actionType })

    testOn.existClass({ wrapper }, `text-${variant}`)
    testOn.equalTextValue({ wrapper }, text)
  })
}

describe('TableFields.vue', () => {
  Object.values(ActionType).forEach(key => {
    checkActionNameWithColor(key)
  })
})
