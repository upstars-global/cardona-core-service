import { FieldInfo, FieldType } from '../@model/field'
import { t } from '../plugins/i18n'

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
      label: t('seo.metaTitle'),
      isLocalization: true,
    })
    this.metaDescription = new FieldInfo<string>({
      type: FieldType.Textarea,
      key: 'metaDescription',
      value: data?.metaDescription || '',
      label: t('seo.metaDescription'),
      isLocalization: true,
    })
    this.description = new FieldInfo<string>({
      type: FieldType.RichText,
      key: 'description',
      value: data?.description || '',
      label: t('seo.description'),
      form: null,
      isLocalization: true,
    })
  }
}
