<template>
  <b-dropdown
    :text="$t('action.selectEntity')"
    variant="outline-secondary"
    :disabled="filters.isEmpty"
    :size="size"
  >
    <b-dropdown-item
      v-for="(filter, index) in filters"
      :key="index"
      :link-class="{ 'px-1 py-50 font-small-3': isSmallSize }"
      @click="onChange(filter)"
    >
      {{ filter.label }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FieldInfo } from '@model/field'

export default defineComponent({
  name: 'FilterSelector',

  props: {
    filters: {
      type: Array as PropType<FieldInfo[]>,
      required: true,
    },

    size: {
      type: String,
      default: 'md',
    },
  },

  emits: ['selectedFiltersChanged'],

  setup(props, { emit }) {
    const isSmallSize: boolean = props.size === 'sm'

    const onChange = (filter: FieldInfo) => emit('selectedFiltersChanged', filter)

    return { isSmallSize, onChange }
  },
})
</script>
