import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { permissionLocaleTest } from '../../../tests/unit/mocks/permission-keys'
import { IS_TEST_ENV } from '../../utils/constants'
import { cookieRef } from '@layouts/stores/config'
import { themeConfig } from '@themeConfig'

const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(10, -5), value.default]),
)

let _i18n: any = null

if (IS_TEST_ENV) {
  messages['en'].permission = {
    ...messages['en'].permission,
    ...permissionLocaleTest,
  }
}

export const getI18n = () => {
  if (_i18n === null) {
    _i18n = createI18n({
      legacy: false,
      locale: cookieRef('language', themeConfig.app.i18n.defaultLocale).value,
      fallbackLocale: 'en',
      messages,
    })
  }

  return _i18n
}

export const i18n = getI18n().global

export default function (app: App) {
  app.use(getI18n())
}
