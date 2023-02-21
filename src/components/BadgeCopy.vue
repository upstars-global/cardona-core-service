<template>
  <b-badge :variant="variant" class="cursor-pointer" @click="copyToClipboard(value)">
    <span v-if="isViewLabel">{{ label }}: </span>
    {{ value }}
    <feather-icon icon="CopyIcon" class="ml-25" />
  </b-badge>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { copyToClipboard } from '@/helpers/clipboard'

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
  },

  setup() {
    return {
      copyToClipboard,
    }
  },
})
</script>
