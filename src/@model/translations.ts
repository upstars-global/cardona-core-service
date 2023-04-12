type FieldTranslationsLocaleData = {
  value: string
  disabled: boolean
}

type FieldTranslationsLocale = Record<string, FieldTranslationsLocaleData>

export type FieldTranslationsData = {
  readonly name?: FieldTranslationsLocale
  readonly buttonName?: FieldTranslationsLocale
  readonly title?: FieldTranslationsLocale
  readonly description: FieldTranslationsLocale
  readonly content?: FieldTranslationsLocale
  readonly fakeDescription: FieldTranslationsLocale
  readonly metaTitle: FieldTranslationsLocale
  readonly metaDescription: FieldTranslationsLocale
  readonly fakeMetaTitle: FieldTranslationsLocale
  readonly fakeMetaDescription: FieldTranslationsLocale
}
