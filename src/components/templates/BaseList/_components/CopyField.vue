<script lang="ts" setup>
import { computed } from 'vue'
import { copyToClipboard } from '../../../../helpers/clipboard'
import { getShortString } from '../../../../helpers'

interface Props {
  value: string
  isShort?: boolean
}

const props = defineProps<Props>()

const labelValue = computed(() => (props.isShort ? getShortString(props.value) : props.value))
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
