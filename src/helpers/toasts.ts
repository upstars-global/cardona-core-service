import { useToast } from 'vue-toastification'
import ToastificationContent from '../components/templates/toast/ToastificationContent.vue'
import { IconsList } from '../@model/enums/icons'
import type { VColors } from '../@model/vuetify'
import { i18n } from '@/plugins/i18n'

export interface ToastErrorItem {
  /** i18n key suffix; resolved as `toast.error.<localizationKey>` */
  localizationKey: string
  /** Interpolation params passed to `i18n.t` for this error entry */
  options?: Record<string, unknown>
}

type ToastOptions = Record<string | 'defaultCode' | 'defaultDescription', string | undefined>

const defaultOptions: ToastOptions = {
  defaultText: '',
  defaultCode: 'default',
  defaultDescription: '',
}

/**
 * Provides typed toast notification helpers for success and error feedback.
 *
 * @returns `toastSuccess`, `toastError`, `toastErrorMessageString`, `toastBase`
 */
export default function useToastService() {
  const toast = useToast()

  /**
   * Shows a success toast, resolving title and description text from i18n keys.
   *
   * @param code — i18n key suffix; looked up as `toast.success.<code>`, falls back to `toast.success.default`
   * @param options — `defaultDescription` overrides the i18n description text; other keys are interpolated into the title
   */
  const toastSuccess = (code: string, options: ToastOptions = defaultOptions) => {
    const { defaultText = '', defaultCode = 'default', defaultDescription = undefined } = options

    const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : `toast.success.${defaultCode}`

    const text = defaultDescription || (i18n.te(`toast.success.${code}-text`)
      ? i18n.t(`toast.success.${code}-text`)
      : undefined)

    toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: IconsList.CheckCircleIcon,
        variant: 'success',
        text,
      },
    })
  }

  function safeTe(key: string): boolean {
    const translated = i18n.t(key, {}, { default: '' })

    return translated !== '' && translated !== key
  }

  /**
   * Shows an error toast. Multiple items display a count in the title and list individual messages in the body.
   *
   * @param input — error code string, a single `ToastErrorItem`, or an array of items
   * @param options — `defaultCode` fallback key suffix; `defaultText` used when no i18n match is found
   */
  const toastError = (input: string | ToastErrorItem | ToastErrorItem[], options: ToastOptions = defaultOptions) => {
    const codes: ToastErrorItem[] = typeof input === 'string'
      ? [{ localizationKey: input }]
      : Array.isArray(input) ? input : [input]

    const isListErrors = codes.length > 1
    const fullKey = isListErrors ? 'toast.error.amount' : `toast.error.${codes[0].localizationKey}`
    const fallbackKey = `toast.error.${options?.defaultCode}`

    const message = safeTe(fullKey)
      ? i18n.t(fullKey, { ...options, amount: codes.length })
      : options?.defaultText || i18n.t(fallbackKey, options)

    const text = isListErrors ? codes.map(code => i18n.t(`toast.error.${code.localizationKey}`, code.options)) : ''

    toast({
      component: ToastificationContent,
      props: {
        title: message,
        icon: IconsList.AlertTriangleIcon,
        variant: 'error',
        text,
      },
    })
  }

  /**
   * Shows an error toast with a raw message string, stripping the `'Invalid response. '` prefix if present.
   *
   * @param message — raw server error message to display
   */
  const toastErrorMessageString = (message: string) => {
    const strToRemove = 'Invalid response. '
    const newMessage = message.replace(strToRemove, '')

    toast({
      component: ToastificationContent,
      props: {
        title: newMessage,
        icon: IconsList.AlertTriangleIcon,
        variant: 'error',
      },
    })
  }

  /**
   * Low-level toast with explicit control over the component, variant, icon, and extra props.
   *
   * @param message — title text shown in the toast
   * @param config — `variant` (Vuetify color), `icon` (`IconsList`), `component` (defaults to `ToastificationContent`), `params` (extra props spread onto the component)
   */
  const toastBase = (message: string, config: {
    component: Component
    variant: VColors
    icon: IconsList
    params?: Record<string, unknown>
  }) => {
    const { component = ToastificationContent, variant, icon, params = {} } = config

    toast({
      component,
      props: {
        title: message,
        icon,
        variant,
        ...params,
      },
    })
  }

  return {
    toastBase,
    toastSuccess,
    toastError,
    toastErrorMessageString,
  }
}
