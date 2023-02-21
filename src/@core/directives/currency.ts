import Vue from 'vue'

Vue.directive('currency', {
  bind(el, binding) {
    el.innerText = binding.value ? (binding.value / 100).toFixed(2) : '0'
  },
})
