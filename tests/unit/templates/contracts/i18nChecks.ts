// Dotted lowercase identifier shape ('page.demo.switchField', 'common.email') — how every real
// i18n key in this project looks (see src/plugins/i18n/locales/*.json). A literal display string
// passed as a label/title ('USD', 'Click me') never matches this shape, so the check only flags
// values that were actually meant to be translated.
const I18N_KEY_SHAPE = /^[a-z][a-z0-9]*(\.[a-z0-9_]+){1,}$/i

export const looksLikeI18nKey = (value: unknown): value is string =>
  typeof value === 'string' && I18N_KEY_SHAPE.test(value)
