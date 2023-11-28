import { FieldInfo, FieldType } from './field'

// import { tagsList } from '@/@fake-db/demo/demoListData'

export enum ProjectFilterTypes {
  Tags = 'tags',
}

const tags = new FieldInfo<Array<string>>({
  type: FieldType.MultiSelect,
  key: ProjectFilterTypes.Tags,
  label: '',
  placeholder: '',
  options: [],
})

export default {
  tags,
}
