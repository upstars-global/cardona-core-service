export const currency = {
  beforeMount(el, binding) {
    el.innerText = binding.value ? (binding.value / 100).toFixed(2) : '0'
  },
}
