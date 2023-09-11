import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue } from '@vue/test-utils'

export const createMockVue = () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(BootstrapVue)

  return localVue
}

export const generateTestSelector = (elementId) => {
  return `[data-testid=${elementId}]`
}
