import vSelect from 'vue-select'
import type { Component } from 'vue'
import { setMountComponent as setMountComponentGeneral } from '../../utils'

export const setMountComponentSelect = (component: Component) => (props: unknown) => setMountComponentGeneral(component)(props, {
  components: {
    VueSelect: vSelect,
  },
})
