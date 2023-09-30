import i18n from '../plugins/i18n'
import { tagsList } from '../@fake-db/data/demo'
import { FieldInfo, FieldType } from './field'

export enum ProjectFilterTypes {
  Tags = 'tags',
}

const tags = new FieldInfo<Array<string>>({
  type: FieldType.MultiSelect,
  key: ProjectFilterTypes.Tags,
  label: i18n.global.t('common.tags'),
  placeholder: i18n.global.t('placeholder.filter.tags'),
  options: tagsList,
})

export default {
  tags,
}
