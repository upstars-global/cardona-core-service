export const getCurrency = (value: number): number | '0' => value ? (value / 100).toFixed(2) : '0'
export const currency = {
  beforeMount(el, binding) {
    el.textContent = binding.value ? (binding.value / 100).toFixed(2) : '0'
  },
}
