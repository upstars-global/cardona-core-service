export default {
  mounted(el, binding) {
    const { to, from = 0, duration = 1000 } = binding.value || {}

    if (typeof to !== 'number')
      return

    const start = performance.now()

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)

      el.textContent = Math.floor(from + (to - from) * progress)

      if (progress < 1)
        requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  },

  updated(el, binding) {
    const oldTo = binding.oldValue?.to
    const newTo = binding.value?.to

    if (newTo !== oldTo)
      this.mounted(el, binding)
  },
}
