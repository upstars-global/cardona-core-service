import { t } from '../plugins/i18n'
import { FieldInfo, FieldType } from './field'
import { tagsList } from '@/@fake-db/demo/demoListData'

export enum ProjectFilterTypes {
  Tags = 'tags',
}

const tags = new FieldInfo<Array<string>>({
  type: FieldType.MultiSelect,
  key: ProjectFilterTypes.Tags,
  label: t('common.tags'),
  placeholder: t('placeholder.filter.tags'),
  options: tagsList,
})

export default {
  tags,
}
