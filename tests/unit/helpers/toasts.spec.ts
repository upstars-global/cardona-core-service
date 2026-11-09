import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import useToastService from '../../../src/helpers/toasts'
import { i18n } from '../../../src/plugins/i18n'

const { toastMock } = vi.hoisted(() => ({ toastMock: vi.fn() }))

vi.mock('vue-toastification', () => ({
  useToast: () => toastMock,
}))

const getToastProps = () => toastMock.mock.calls.at(-1)?.[0].props ?? {}

describe('useToastService.toastError', () => {
  beforeAll(() => {
    i18n.mergeLocaleMessage('en', {
      toast: {
        error: {
          Test_title_INTERSECT: 'Intersects with the {title} event',
          Test_gift_MANUAL: 'Already selected for the gift {giftName}',
          Test_fallback: 'Fallback {field}',
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('interpolates item options into the title of a single error', () => {
    useToastService().toastError([{ localizationKey: 'Test_gift_MANUAL', options: { giftName: '"manual_gift"' } }])

    expect(getToastProps().title).toBe('Already selected for the gift "manual_gift"')
    expect(getToastProps().text).toBe('')
  })

  it('interpolates item options into every message of an error list', () => {
    useToastService().toastError([
      { localizationKey: 'Test_title_INTERSECT', options: { title: 'Base cashback' } },
      { localizationKey: 'Test_gift_MANUAL', options: { giftName: 'Gift' } },
    ])

    expect(getToastProps().title).toBe(i18n.t('toast.error.amount', { amount: 2 }))
    expect(getToastProps().text).toEqual([
      'Intersects with the Base cashback event',
      'Already selected for the gift Gift',
    ])
  })

  it('ignores the item defaultCode and falls back to the default message when the key is missing', () => {
    useToastService().toastError([
      { localizationKey: 'Test_missing_KEY', options: { field: 'slug', defaultCode: 'Test_fallback' } },
    ])

    expect(getToastProps().title).toBe(i18n.t('toast.error.default'))
  })

  it('uses defaultText for a string code without translation', () => {
    useToastService().toastError('Test_missing_KEY', { defaultText: 'Raw description' })

    expect(getToastProps().title).toBe('Raw description')
  })

  it('lets item options override same-named second-arg options in a single error', () => {
    useToastService().toastError(
      { localizationKey: 'Test_gift_MANUAL', options: { giftName: 'Item' } },
      { giftName: 'Arg', defaultCode: 'default' },
    )

    expect(getToastProps().title).toBe('Already selected for the gift Item')
  })

  it('translates a single error with an existing key and no item options', () => {
    useToastService().toastError({ localizationKey: 'Test_gift_MANUAL' })

    expect(getToastProps().title).toBe('Already selected for the gift ')
    expect(getToastProps().text).toBe('')
  })

  it('uses defaultText from the second argument when the key of a single error is missing', () => {
    useToastService().toastError(
      { localizationKey: 'Test_missing_KEY', options: { field: 'slug' } },
      { defaultText: 'Custom text' },
    )

    expect(getToastProps().title).toBe('Custom text')
  })

  it('interpolates second-arg options for a string input with a real core key', () => {
    useToastService().toastError('fileSizeError', { MB: '5' })

    expect(getToastProps().title).toBe('File is larger than 5 MB')
  })

  it('uses the amount key with the count in the title of a list and ignores item options', () => {
    useToastService().toastError([
      { localizationKey: 'Test_title_INTERSECT', options: { amount: 99, title: 'A' } },
      { localizationKey: 'Test_gift_MANUAL', options: { giftName: 'B' } },
      { localizationKey: 'Test_fallback', options: { field: 'C' } },
    ])

    expect(getToastProps().title).toBe(i18n.t('toast.error.amount', { amount: 3 }))
  })

  it('does not leak options between items of a list', () => {
    useToastService().toastError([
      { localizationKey: 'Test_title_INTERSECT', options: { title: 'A', giftName: 'LEAK' } },
      { localizationKey: 'Test_gift_MANUAL' },
    ])

    expect(getToastProps().text).toEqual(['Intersects with the A event', 'Already selected for the gift '])
  })
})
