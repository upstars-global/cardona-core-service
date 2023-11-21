import i18n from '../plugins/i18n'
import { RichTextBaseField, TextBaseField, TextareaBaseField } from '../@model/templates/baseField'

export interface SeoData {
  readonly metaTitle?: string
  readonly metaDescription?: string
  readonly description?: string
}

export class SeoForm {
  readonly metaTitle: TextBaseField
  readonly metaDescription: TextareaBaseField
  readonly description: RichTextBaseField

  constructor(data?: SeoData) {
    this.metaTitle = new TextBaseField({
      key: 'metaTitle',
      value: data?.metaTitle || '',
      label: i18n.global.t('seo.metaTitle'),
      isLocalization: true,
    })
    this.metaDescription = new TextareaBaseField({
      key: 'metaDescription',
      value: data?.metaDescription,
      label: i18n.global.t('seo.metaDescription'),
      isLocalization: true,
    })
    this.description = new RichTextBaseField({
      key: 'description',
      value: data?.description,
      label: i18n.global.t('seo.description'),
      form: null,
      isLocalization: true,
    })
  }
}
