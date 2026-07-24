import { RichTextBaseField, TextBaseField, TextareaBaseField } from '../@model/templates/baseField'

export interface SeoData {
  readonly metaTitle?: string
  readonly metaDescription?: string
  readonly description?: string
}

const DEFAULT_SEO_FIELD_VALUE = '&nbsp;'

export class SeoForm {
  readonly metaTitle: TextBaseField
  readonly metaDescription: TextareaBaseField
  readonly description: RichTextBaseField

  constructor(data?: SeoData) {
    this.metaTitle = new TextBaseField({
      key: 'metaTitle',
      value: data?.metaTitle || DEFAULT_SEO_FIELD_VALUE,
      label: 'seo.metaTitle',
      isLocalization: true,
    })
    this.metaDescription = new TextareaBaseField({
      key: 'metaDescription',
      value: data?.metaDescription || DEFAULT_SEO_FIELD_VALUE,
      label: 'seo.metaDescription',
      placeholder: 'seo.metaDescription',
      isLocalization: true,
    })
    this.description = new RichTextBaseField({
      key: 'description',
      value: data?.description || DEFAULT_SEO_FIELD_VALUE,
      label: 'seo.description',
      form: null,
      isLocalization: true,
    })
  }
}
