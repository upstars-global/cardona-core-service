<template>
  <b-badge
    :variant="variant"
    class="cursor-pointer overflow-hidden copy-badge"
    @click="copyToClipboard(value)"
  >
    <span v-if="isViewLabel">{{ label }}: </span>
    <span v-if="isShort">{{ valueShort }}</span>
    <span v-else>{{ value }}</span>
    <feather-icon icon="CopyIcon" class="ml-25" />
  </b-badge>
</template>

<script lang="ts">
import { ComputedRef, computed, defineComponent } from 'vue'
import { copyToClipboard } from '../helpers/clipboard'
import { getShortString } from '../helpers/index'

export default defineComponent({
  name: 'BadgeCopy',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },

    variant: {
      type: String,
      default: 'light-secondary',
    },

    label: {
      type: String,
      default: 'ID',
    },

    isViewLabel: {
      type: Boolean,
      default: true,
    },

    isShort: {
      type: Boolean,
      default: false,
    },

    maxLengthForShort: {
      type: Number,
      default: 8,
    },
  },

  setup(props) {
    const valueShort: ComputedRef<string | number> = computed(() => {
      return String(props.value).length > props.maxLengthForShort
        ? getShortString(props.value)
        : props.value
    })

    return {
      copyToClipboard,
      valueShort,
    }
  },
})
</script>

<style lang="scss" scoped>
.copy-badge {
  text-overflow: ellipsis;
}
</style>
