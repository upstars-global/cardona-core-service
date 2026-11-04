import LayoutBlank from '../layouts/blank.vue'
import LayoutDefault from '../layouts/default.vue'

export enum CoreLayouts {
  Default = 'default',
  Blank = 'blank',
}

export const CoreLayoutsMap: Record<string, Component> = {
  [CoreLayouts.Default]: LayoutDefault,
  [CoreLayouts.Blank]: LayoutBlank,
}
