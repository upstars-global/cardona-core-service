import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import LocaleForm from '../../../../src/components/templates/LocaleForm/index.vue'

const mockUseUserStore = vi.hoisted(() => vi.fn())

vi.mock('../../../../src/stores/user', () => ({
  useUserStore: mockUseUserStore,
}))

vi.mock('../../../../src/stores/locale', () => ({
  useLocaleStore: () => ({
    allLocales: { ru: 'Russian', en: 'English', de: 'German', fr: 'French' },
  }),
}))

vi.mock('../../../../src/stores/textEditor', () => ({
  useTextEditorStore: () => ({ variableTextBuffer: {} }),
}))

vi.mock('../../../../src/stores/appConfigCore', () => ({
  useAppConfigCoreStore: () => ({ allCurrencies: [] }),
}))

const MAIN_LOCALE = 'ru'
const PROJECT_LOCALES = ['ru', 'en', 'de']

const makeForm = (
  fieldKeys: string[] = ['title'],
  extraTranslations: Record<string, Record<string, any>> = {},
) => ({
  ...Object.fromEntries(fieldKeys.map(key => [key, { value: `Main ${key}` }])),
  fieldTranslations: Object.fromEntries(
    fieldKeys.map(key => [key, { ...(extraTranslations[key] ?? {}) }]),
  ),
})

const defaultProps = (form: any) => ({
  form,
  modelValue: {},
  disabled: false,
})

const stubs = {
  TextEditorWysiwyg: true,
  CheckField: true,
  InputTextWrapper: {
    template: '<div><slot :children-style="{}" /><slot name="footer" :is-show-button="false" /></div>',
    props: ['content'],
  },
}

beforeEach(() => {
  mockUseUserStore.mockReturnValue({
    getSelectedProject: { mainLocale: MAIN_LOCALE, locales: PROJECT_LOCALES },
  })
})

describe('LocaleForm.vue', () => {
  describe('projectLocales computed', () => {
    it('returns locales as-is when mainLocale is already in the array', () => {
      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm()),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(PROJECT_LOCALES.length)
    })

    it('prepends mainLocale when it is missing from project locales', () => {
      mockUseUserStore.mockReturnValue({
        getSelectedProject: { mainLocale: 'ru', locales: ['en', 'de'] },
      })

      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm()),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(3)
    })

    it('renders only the mainLocale row when locales array is empty', () => {
      mockUseUserStore.mockReturnValue({
        getSelectedProject: { mainLocale: 'ru', locales: [] },
      })

      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm()),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(1)
    })

    it('falls back to "ru" as mainLocale when selectedProject is null', () => {
      mockUseUserStore.mockReturnValue({ getSelectedProject: null })

      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm()),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(1)
    })
  })

  describe('watch: missing locale initialization', () => {
    it('initializes missing non-main locales with { value: "", disabled: false } on mount', () => {
      const form = makeForm()

      mount(LocaleForm, { props: defaultProps(form), global: { stubs } })

      expect(form.fieldTranslations.title.en).toEqual({ value: '', disabled: false })
      expect(form.fieldTranslations.title.de).toEqual({ value: '', disabled: false })
    })

    it('does NOT create a fieldTranslations entry for the main locale', () => {
      const form = makeForm()

      mount(LocaleForm, { props: defaultProps(form), global: { stubs } })

      expect(form.fieldTranslations.title[MAIN_LOCALE]).toBeUndefined()
    })

    it('does NOT overwrite locale entries that already have a value', () => {
      const existingEn = { value: 'existing text', disabled: true }
      const form = makeForm(['title'], { title: { en: existingEn } })

      mount(LocaleForm, { props: defaultProps(form), global: { stubs } })

      expect(form.fieldTranslations.title.en).toEqual(existingEn)
    })

    it('initializes missing locales across all field keys', () => {
      const form = makeForm(['title', 'description'])

      mount(LocaleForm, { props: defaultProps(form), global: { stubs } })

      for (const key of ['title', 'description']) {
        expect(form.fieldTranslations[key].en).toEqual({ value: '', disabled: false })
        expect(form.fieldTranslations[key].de).toEqual({ value: '', disabled: false })
      }
    })

    it('does not throw when fieldTranslations is null', () => {
      const form = { title: { value: 'Main' }, fieldTranslations: null }

      expect(() =>
        mount(LocaleForm, { props: defaultProps(form), global: { stubs } }),
      ).not.toThrow()
    })

    it('initializes newly added locales when projectLocales changes reactively', async () => {
      const project = reactive({ mainLocale: 'ru', locales: ['ru', 'en'] })
      mockUseUserStore.mockReturnValue({ getSelectedProject: project })

      const form = makeForm()

      mount(LocaleForm, { props: defaultProps(form), global: { stubs } })

      expect(form.fieldTranslations.title.en).toEqual({ value: '', disabled: false })
      expect(form.fieldTranslations.title.de).toBeUndefined()

      project.locales = ['ru', 'en', 'de']
      await nextTick()

      expect(form.fieldTranslations.title.de).toEqual({ value: '', disabled: false })
    })
  })

  describe('template rendering', () => {
    it('renders exactly (localeCount) rows for a single-field form', () => {
      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm(['title'])),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(PROJECT_LOCALES.length)
    })

    it('renders (fieldCount × localeCount) rows for a multi-field form', () => {
      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm(['title', 'description'])),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(2 * PROJECT_LOCALES.length)
    })

    it('does NOT render rows for locales present in fieldTranslations but not in projectLocales', () => {
      const form = {
        title: { value: 'Main title' },
        fieldTranslations: {
          title: { fr: { value: 'French text', disabled: false } },
        },
      }

      const wrapper = mount(LocaleForm, {
        props: defaultProps(form),
        global: { stubs },
      })

      expect(wrapper.findAll('.row-item-field-translations')).toHaveLength(PROJECT_LOCALES.length)
      expect(wrapper.find('[data-at="text-title-fr"]').exists()).toBe(false)
    })

    it('adds order-first class only to the main locale row', () => {
      const wrapper = mount(LocaleForm, {
        props: defaultProps(makeForm(['title'])),
        global: { stubs },
      })

      const rows = wrapper.findAll('.row-item-field-translations')
      const orderFirstCount = rows.filter(r => r.classes().includes('order-first')).length

      expect(orderFirstCount).toBe(1)
    })
  })
})
