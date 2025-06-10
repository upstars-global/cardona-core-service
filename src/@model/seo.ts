import { i18n } from '../plugins/i18n'
import { RichTextBaseField, TextBaseField, TextareaBaseField } from '../@model/templates/baseField'

export interface SeoData {
  readonly metaTitle?: string
  readonly metaDescription?: string
  readonly description?: string
}

const DEFAULT_META_TITLE = ' '

export class SeoForm {
  readonly metaTitle: TextBaseField
  readonly metaDescription: TextareaBaseField
  readonly description: RichTextBaseField

  constructor(data?: SeoData) {
    this.metaTitle = new TextBaseField({
      key: 'metaTitle',
      value: data?.metaTitle || DEFAULT_META_TITLE,
      label: i18n.t('seo.metaTitle'),
      isLocalization: true,
    })
    this.metaDescription = new TextareaBaseField({
      key: 'metaDescription',
      value: data?.metaDescription,
      label: i18n.t('seo.metaDescription'),
      placeholder: i18n.t('seo.metaDescription'),
      isLocalization: true,
    })
    this.description = new RichTextBaseField({
      key: 'description',
      value: data?.description,
      label: i18n.t('seo.description'),
      form: null,
      isLocalization: true,
    })
  }
}
