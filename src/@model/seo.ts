import { FieldInfo, FieldType } from '../@model/field'
import i18n from '../plugins/i18n'

export interface SeoData {
  readonly metaTitle?: string
  readonly metaDescription?: string
  readonly description?: string
}

export class SeoForm {
  readonly metaTitle: FieldInfo<string>
  readonly metaDescription: FieldInfo<string>
  readonly description: FieldInfo<string>

  constructor(data?: SeoData) {
    this.metaTitle = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'metaTitle',
      value: data?.metaTitle || '',
      label: i18n.global.t('seo.metaTitle'),
      isLocalization: true,
    })
    this.metaDescription = new FieldInfo<string>({
      type: FieldType.Textarea,
      key: 'metaDescription',
      value: data?.metaDescription || '',
      label: i18n.global.t('seo.metaDescription'),
      isLocalization: true,
    })
    this.description = new FieldInfo<string>({
      type: FieldType.RichText,
      key: 'description',
      value: data?.description || '',
      label: i18n.global.t('seo.description'),
      form: null,
      isLocalization: true,
    })
  }
}
