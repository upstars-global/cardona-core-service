import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../../libs/i18n/locales/en.json'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
})

const loadedLanguages = [i18n.locale]

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

setI18nLanguage(i18n.locale)

export function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language hasn't been loaded yet
  return import(
    /* webpackChunkName: "lang-[request]" */ `../../libs/i18n/locales/${lang}.json`
  ).then((messages) => {
    i18n.setLocaleMessage(lang, messages)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}

export default i18n
