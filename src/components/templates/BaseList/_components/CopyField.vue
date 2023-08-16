<script lang="ts">
import { computed } from 'vue'
import { copyToClipboard } from '../../../../helpers/clipboard'
import { getShortString } from '../../../../helpers'

export default {
  name: 'CopyField',
  props: {
    value: {
      type: String,
      required: true,
    },
    isShort: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const labelValue = computed(() => (props.isShort ? getShortString(props.value) : props.value))

    return {
      labelValue,
      copyToClipboard,
    }
  },
}
</script>

<template>
  <div v-if="value" class="text-break copy-field">
    <slot :label="labelValue">
      <span>
        {{ labelValue }}
      </span>
    </slot>

    <feather-icon
      icon="CopyIcon"
      class="cursor-pointer ml-25"
      @click.stop="copyToClipboard(value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.copy-field {
  min-width: 120px;
}
</style>
