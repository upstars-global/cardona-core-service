import { FieldInfo, FieldType } from '../@model/field'
import i18n from '../libs/i18n'

export interface SeoData {
  readonly metaTitle?: string
  readonly fakeMetaTitle?: string
  readonly metaDescription?: string
  readonly fakeMetaDescription?: string
  readonly description?: string
  readonly fakeDescription?: string
}

export class SeoForm {
  readonly metaTitle: FieldInfo<string>
  readonly fakeMetaTitle: FieldInfo<string>
  readonly metaDescription: FieldInfo<string>
  readonly fakeMetaDescription: FieldInfo<string>
  readonly description: FieldInfo<string>
  readonly fakeDescription: FieldInfo<string>

  constructor(data?: SeoData) {
    this.metaTitle = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'metaTitle',
      value: data?.metaTitle || '',
      label: String(i18n.t('seo.metaTitle')),
      isLocalization: true,
    })
    this.fakeMetaTitle = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'fakeMetaTitle',
      value: data?.fakeMetaTitle || '',
      label: String(i18n.t('seo.fakeMetaTitle')),
      isLocalization: true,
    })
    this.metaDescription = new FieldInfo<string>({
      type: FieldType.Textarea,
      key: 'metaDescription',
      value: data?.metaDescription || '',
      label: String(i18n.t('seo.metaDescription')),
      isLocalization: true,
    })
    this.fakeMetaDescription = new FieldInfo<string>({
      type: FieldType.Textarea,
      key: 'fakeMetaDescription',
      value: data?.fakeMetaDescription || '',
      label: String(i18n.t('seo.fakeMetaDescription')),
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
    this.fakeDescription = new FieldInfo<string>({
      type: FieldType.RichText,
      key: 'fakeDescription',
      value: data?.fakeDescription || '',
      label: String(i18n.t('seo.fakeDescription')),
      isLocalization: true,
      form: null,
    })
  }
}
