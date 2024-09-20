<script lang="ts" setup>
import { computed } from 'vue'
import { copyToClipboard } from '../../../helpers/clipboard'
import { IconsList } from '../../../@model/enums/icons'
import { getShortString } from '../../../helpers'
import { VSizes } from '../../../@model/vuetify'

const props = defineProps<{
  value: string
  isShort?: boolean
}>()

const labelValue = computed(() => (props.isShort ? getShortString(props.value) : props.value))
</script>

<template>
  <div
    v-if="value"
    class="text-break copy-field d-flex align-center"
  >
    <slot :label="labelValue">
      <span test-id="copy-field-value">
        {{ labelValue }}
      </span>
    </slot>

    <VIcon
      :icon="IconsList.CopyIcon"
      test-id="copy-field-icon"
      class="cursor-pointer ml-1 text-color-mute"
      size="16"
      @click.stop="copyToClipboard(value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.copy-field {
  min-width: 120px;
}
</style>
