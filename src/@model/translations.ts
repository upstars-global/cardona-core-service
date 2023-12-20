import store from "../store";

interface FieldTranslationsLocaleData {
  value: string
  disabled: boolean
}

export type FieldTranslationsLocale = Record<string, FieldTranslationsLocaleData>
export type LocaleVariable = Record<string, Record<string, string>>
export type TranslationForm = Record<string, Record<string, FieldTranslationsLocaleData>>
export interface FieldTranslationsData {
  readonly name?: FieldTranslationsLocale
  readonly buttonName?: FieldTranslationsLocale
  readonly title?: FieldTranslationsLocale
  readonly description: FieldTranslationsLocale
  readonly content?: FieldTranslationsLocale
  readonly metaTitle: FieldTranslationsLocale
  readonly metaDescription: FieldTranslationsLocale
}

export const getTranslationForm = (form: Record<string, any>, data: Record<string, any>): TranslationForm => {
  const { locales } = store.getters.selectedProject;
  const keys: string[] = []

  Object.keys(form).forEach(key => {
    if (form[key]?.isLocalization)
      keys.push(key)
  })
  if (form.hasOwnProperty('seo')) {
    Object.keys(form.seo).forEach(key => {
      if (form.seo[key]?.isLocalization)
        keys.push(key)
    })
  }
  let translationsForm: TranslationForm = {}
  keys.forEach((key: string) => {
    translationsForm[key] = {}
    locales.forEach((locale: string) => {
      translationsForm[key][locale] = {
        value: data?.fieldTranslations[key] ? data?.fieldTranslations[key][locale].value || '' : '',
        disabled: false,
      }
    })
  })

  return translationsForm
}
