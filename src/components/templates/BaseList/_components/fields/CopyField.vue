<script lang="ts" setup>
import { computed } from 'vue'
import { IconsList } from '../../../../../@model/enums/icons'
import { getShortString } from '../../../../../helpers'
import { copyToClipboard } from '../../../../../helpers/clipboard'

interface Props {
  value: string
  isShort?: boolean
}

const props = defineProps<Props>()

const labelValue = computed(() => (props.isShort ? getShortString(props.value) : props.value))
</script>

<template>
  <div
    v-if="value"
    class="text-break copy-field d-flex align-center gap-2"
  >
    <slot :label="labelValue">
      <span>
        {{ labelValue }}
      </span>
    </slot>

    <VIcon
      :icon="IconsList.CopyIcon"
      class="cursor-pointer"
      @click.stop="copyToClipboard(value)"
      size="16"
    />
  </div>
</template>

<style lang="scss" scoped>
.copy-field {
  min-width: 120px;
  white-space: nowrap;
}
</style>
