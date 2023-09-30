interface FieldTranslationsLocaleData {
  value: string
  disabled: boolean
}

export type FieldTranslationsLocale = Record<string, FieldTranslationsLocaleData>
export type LocaleVariable = Record<string, Record<string, string>>

export interface FieldTranslationsData {
  readonly name?: FieldTranslationsLocale
  readonly buttonName?: FieldTranslationsLocale
  readonly title?: FieldTranslationsLocale
  readonly description: FieldTranslationsLocale
  readonly content?: FieldTranslationsLocale
  readonly metaTitle: FieldTranslationsLocale
  readonly metaDescription: FieldTranslationsLocale
}
