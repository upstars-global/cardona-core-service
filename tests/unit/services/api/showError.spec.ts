import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import ApiService from '../../../../src/services/api'
import { i18n } from '../../../../src/plugins/i18n'

const { toastMock } = vi.hoisted(() => ({ toastMock: vi.fn() }))

vi.mock('vue-toastification', () => ({
  useToast: () => toastMock,
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({}),
  useRouter: () => ({}),
}))

const getToastProps = () => toastMock.mock.calls.at(-1)?.[0].props

type ShowError = (error: unknown, entity: string, formRef: unknown, withErrorDescriptionToast: boolean) => void

const showError = (error: unknown, entity = 'Test', formRef?: unknown, withDescription = false) =>
  (Reflect.get(ApiService, 'showError') as ShowError).call(ApiService, error, entity, formRef, withDescription)

describe('ApiService.showError', () => {
  beforeAll(() => {
    i18n.mergeLocaleMessage('en', {
      toast: {
        error: {
          Test_gift_MANUAL: 'Already selected for the gift {giftName}',
          Test_title_INTERSECT: 'Intersects with {title}',
          Test_fallback: 'Fallback {field}',
        },
      },
      validations: {
        Test_name_EXISTS: 'Name {giftName} already exists',
        Test_gift_MANUAL: 'Gift {giftName} is already used',
        Test_title_BUSY: 'Title {title} is busy',
      },
      Test_root_KEY: 'Root text',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('interpolates flat toastOptions from validationErrorCb into the title of a single error', () => {
    const formRef = {
      setErrors: vi.fn(),
      validationErrorCb: () => ({ localeKey: 'Test_gift_MANUAL', toastOptions: { giftName: 'X' } }),
    }

    showError({ validationErrors: [{ code: 'MANUAL', field: 'gift', params: {} }] }, 'Test', formRef)

    expect(getToastProps().title).toBe('Already selected for the gift X')
  })

  it('interpolates toastOptions into every text line of multiple errors', () => {
    const formRef = {
      setErrors: vi.fn(),
      validationErrorCb: () => ({ localeKey: 'Test_title_INTERSECT', toastOptions: { title: 'T' } }),
    }

    showError({
      validationErrors: [
        { code: 'A', field: 'a', params: {} },
        { code: 'B', field: 'b', params: {} },
      ],
    }, 'Test', formRef)

    expect(getToastProps().text).toEqual(['Intersects with T', 'Intersects with T'])
  })

  it('ignores the item defaultCode and shows the generic message when the toast key is missing', () => {
    const formRef = {
      setErrors: vi.fn(),
      validationErrorCb: () => ({ localeKey: 'Test_missing_KEY', toastOptions: { defaultCode: 'Test_fallback' } }),
    }

    showError({ validationErrors: [{ code: 'X', field: 'f', params: {} }] }, 'Test', formRef)

    expect(getToastProps().title).toBe(i18n.t('toast.error.default'))
  })

  it('shows the translation and sets form errors from validations.<key> without a callback', () => {
    const formRef = { setErrors: vi.fn() }

    showError({ validationErrors: [{ code: 'MANUAL', field: 'gift', params: {} }] }, 'Test', formRef)

    expect(getToastProps().title).toBe('Already selected for the gift ')
    expect(formRef.setErrors).toHaveBeenCalledWith({ gift: 'Gift  is already used' })
  })

  it('falls back to the root key for form errors when validations.<key> is absent', () => {
    const formRef = {
      setErrors: vi.fn(),
      validationErrorCb: () => ({ localeKey: 'Test_root_KEY' }),
    }

    showError({ validationErrors: [{ code: 'X', field: 'f', params: {} }] }, 'Test', formRef)

    expect(formRef.setErrors).toHaveBeenCalledWith({ f: 'Root text' })
  })

  it('suffixes the form error field with the currency param', () => {
    const formRef = { setErrors: vi.fn() }

    showError({ validationErrors: [{ code: 'MANUAL', field: 'gift', params: { currency: 'EUR' } }] }, 'Test', formRef)

    expect(formRef.setErrors).toHaveBeenCalledWith({ gift_EUR: expect.any(String) })
  })

  it('uses the description as defaultText for a typed error without translation', () => {
    showError({ type: 'Test_missing_KEY', description: 'Server says no' })

    expect(getToastProps().title).toBe('Server says no')
  })
})
