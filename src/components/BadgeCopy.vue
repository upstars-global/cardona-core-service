<template>
  <b-badge
    :variant="variant"
    class="cursor-pointer overflow-hidden copy-badge"
    @click="copyToClipboard(value)"
  >
    <span v-if="isViewLabel">{{ label }}: </span>
    {{ valueShort }}
    <feather-icon :icon="IconsList.CopyIcon" class="ml-25" />
  </b-badge>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { copyToClipboard } from '../helpers/clipboard'
import { getShortString } from '../helpers/index'
import { IconsList } from '../@model/enums/icons'

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
    const valueShort = computed(() => {
      return props.isShort && String(props.value).length > props.maxLengthForShort
        ? getShortString(props.value)
        : props.value
    })

    return {
      copyToClipboard,
      valueShort,
      IconsList,
    }
  },
})
</script>

<style lang="scss" scoped>
.copy-badge {
  text-overflow: ellipsis;
}
</style>
