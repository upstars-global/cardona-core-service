import '../../mocks/base-section/static'
import { i18n } from '../../../../src/plugins/i18n'
import { SelectBaseField, SwitchBaseField } from '../../../../src/@model/templates/baseField'
import { createBaseSectionContract } from './createBaseSectionContract'

class MockForm {
  readonly id?: string
  readonly isActive: SwitchBaseField
  readonly type: SelectBaseField

  constructor(data: { id?: string; isActive?: boolean; type?: string } = {}) {
    this.id = data?.id
    this.isActive = new SwitchBaseField({
      key: 'isActive',
      value: data?.isActive,
      label: i18n.t('userStatuses.active'),
    })
    this.type = new SelectBaseField({
      key: 'type',
      value: data?.type,
      label: 'Type',
      options: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }],
    })
  }
}

const useEntity = () => ({
  entityName: 'mock-form',
  EntityFormClass: MockForm,
})

createBaseSectionContract({
  useEntity,
  formVariants: [
    { input: {}, description: 'empty (create)' },
    { input: { id: '1', isActive: true, type: 'a' }, description: 'full (update)' },
  ],
  selectFields: [
    { key: 'type', source: 'static' },
  ],
  actions: {
    create: { expect: 'createEntity' },
    update: { expect: 'updateEntity' },
    read: { expect: 'readEntity' },
  },
})
