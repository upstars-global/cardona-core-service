import { i18n } from '../plugins/i18n'
import { tagsList } from '../@fake-db/demo/demoListData'
import { MultiSelectBaseField } from '../@model/templates/baseField'

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
