import { useClipboard } from '@vueuse/core'
import useToastService from '../../../helpers/toasts'

const { toastSuccess } = useToastService()

export const useCopyWithToast = () => {
  const { copy } = useClipboard()

  return (text: string, toast: string) => {
    copy(text)
    toastSuccess(toast)
  }
}
