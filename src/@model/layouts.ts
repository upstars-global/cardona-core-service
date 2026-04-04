import LayoutBlank from '../layouts/blank.vue'
import LayoutCustom from '../layouts/custom/index.vue'
import LayoutDefault from '../layouts/default.vue'
import LayoutIsland from '../layouts/island/index.vue'

export enum CoreLayouts {
  Default = 'default',
  Blank = 'blank',
  Island = 'island',
  Custom = 'custom',
}

export const CoreLayoutsMap: Record<string, Component> = {
  [CoreLayouts.Default]: LayoutDefault,
  [CoreLayouts.Blank]: LayoutBlank,
  [CoreLayouts.Island]: LayoutIsland,
  [CoreLayouts.Custom]: LayoutCustom,
}
