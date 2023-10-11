import { FieldInfo, FieldType } from '../@model/field'
import { TextBaseField } from '../@model/baseField'
import i18n from '../libs/i18n'

export interface SeoData {
  readonly metaTitle?: string
  readonly metaDescription?: string
  readonly description?: string
}

export class SeoForm {
  readonly metaTitle: TextBaseField
  readonly metaDescription: FieldInfo<string>
  readonly description: FieldInfo<string>

  constructor(data?: SeoData) {
    this.metaTitle = new TextBaseField({
      key: 'metaTitle',
      value: data?.metaTitle || '',
      label: i18n.t('seo.metaTitle'),
      isLocalization: true,
    })
    this.metaDescription = new FieldInfo<string>({
      type: FieldType.Textarea,
      key: 'metaDescription',
      value: data?.metaDescription || '',
      label: String(i18n.t('seo.metaDescription')),
      isLocalization: true,
    })
    this.description = new FieldInfo<string>({
      type: FieldType.RichText,
      key: 'description',
      value: data?.description || '',
      label: String(i18n.t('seo.description')),
      form: null,
      isLocalization: true,
    })
  }
}
