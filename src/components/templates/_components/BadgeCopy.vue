<script setup lang="ts">
import { computed } from 'vue'
import { getShortString } from '../../../helpers/index'
import { IconsList } from '../../../@model/enums/icons'
import { copyToClipboard } from '../../../helpers/clipboard'

const props = withDefaults(defineProps<{
  value: string | number
  variant?: string
  label?: string
  isViewLabel?: boolean
  isShort?: boolean
  maxLengthForShort?: number
}>(), {
  label: 'ID',
  isViewLabel: true,
  maxLengthForShort: 8,
})

const valueShort = computed(() => {
  return props.isShort && String(props.value).length > props.maxLengthForShort
    ? getShortString(props.value)
    : props.value
})
</script>

<template>
  <div>
    <template v-if="value">
      <VChip
        label
        class="cursor-pointer overflow-hidden copy-badge"
        @click="copyToClipboard(value)"
      >
        <span
          v-if="isViewLabel"
          class="mr-1"
        >{{ label }}: </span>
        {{ valueShort }}
        <VIcon
          :icon="IconsList.CopyIcon"
          class="ml-1"
          size="16"
        />
      </VChip>
    </template>
    <template v-else>
      -
    </template>
  </div>
</template>

<style lang="scss" scoped>
.copy-badge {
  text-overflow: ellipsis;
  color: rgb(var(--v-theme-secondary));
}
</style>
