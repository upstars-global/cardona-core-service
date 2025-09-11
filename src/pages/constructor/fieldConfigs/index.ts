import text from './text.config'
import textarea from './textarea.config'
import select from './select.config'

export { text, textarea, select }

export const byClass: Record<string, any> = {
  TextBaseField: text,
  TextareaBaseField: textarea,
  SelectBaseField: select,
}
