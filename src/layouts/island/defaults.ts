/**
 * Vuetify component defaults scoped to island layout.
 * Applied via provideDefaults() in island/index.vue — affects only components
 * rendered inside the island layout subtree.
 *
 * These layer on top of global defaults (src/plugins/vuetify/defaults.ts).
 * Only override what genuinely differs for island.
 */
export default {
  VCard: {
    elevation: 0,
    rounded: 'lg',
  },
  VSheet: {
    rounded: 'lg',
  },
  VTextField: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VSelect: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VAutocomplete: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VCombobox: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VTextarea: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VFileInput: {
    variant: 'outlined',
    density: 'compact',
    color: 'primary',
    hideDetails: 'auto',
    rounded: 'lg',
  },
  VBtn: {
    rounded: 'lg',
    elevation: 0,
  },
  VChip: {
    rounded: 'lg',
  },
  VList: {
    rounded: 'lg',
    elevation: 0,
  },
  VMenu: {
    rounded: 'lg',
    elevation: 2,
  },
  VDialog: {
    rounded: 'xl',
  },
  VAlert: {
    rounded: 'lg',
  },
  VExpansionPanels: {
    rounded: 'lg',
    elevation: 0,
  },
  VTable: {
    rounded: 'lg',
  },
}
