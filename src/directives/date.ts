import { dayDate, fullDate, fullDateWithSeconds } from '../utils/date'

export const dayDateDirective = {
  beforeMount(el, binding) {
    el.innerText = dayDate(binding.value)
  },
}
export const fullDateDirective = {
  beforeMount(el, binding) {
    el.innerText = fullDate(binding.value)
  },
}

export const fullDateWithSecondsDirective = {
  beforeMount(el, binding) {
    el.innerText = fullDateWithSeconds(binding.value)
  },
}
