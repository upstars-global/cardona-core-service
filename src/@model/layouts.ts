import LayoutBlank from '../layouts/blank.vue'
import LayoutDefault from '../layouts/default.vue'
import LayoutIsland from '../layouts/island.vue'

export enum CoreLayouts {
  Default = 'default',
  Blank = 'blank',
  Island = 'island',
}

export const CoreLayoutsMap: Record<string, Component> = {
  [CoreLayouts.Default]: LayoutDefault,
  [CoreLayouts.Blank]: LayoutBlank,
  [CoreLayouts.Island]: LayoutIsland,
}
