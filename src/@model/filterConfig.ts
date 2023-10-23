import { FieldInfo, FieldType } from './field'
import i18n from '../libs/i18n'
import { tagsList } from '../@fake-db/data/demo'
import { MultiSelectBaseField } from './baseField'

export enum ProjectFilterTypes {
  Tags = 'tags',
}

const tags = new MultiSelectBaseField({
  key: ProjectFilterTypes.Tags,
  label: i18n.t('common.tags'),
  placeholder: i18n.t('placeholder.filter.tags'),
  options: tagsList,
})

export default {
  tags,
}
