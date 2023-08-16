<script lang="ts">
import { computed } from 'vue'
import { copyToClipboard } from '../../../../helpers/clipboard'

export default {
  name: 'CopyField',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props: { value: string }) {
    const labelValue = computed(() => props.value)

    return {
      labelValue,
      copyToClipboard,
    }
  },
}
</script>

<template>
  <div v-if="value" class="text-break copy-field">
    <slot>
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
