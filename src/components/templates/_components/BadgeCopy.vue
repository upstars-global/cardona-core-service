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
  variant: 'light-secondary',
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
  <VChip
    :variant="variant"
    class="cursor-pointer overflow-hidden copy-badge"
    @click="copyToClipboard(value)"
  >
    <span v-if="isViewLabel">{{ label }}: </span>
    {{ valueShort }}
    <VIcon
      :icon="IconsList.CopyIcon"
      class="ml-25"
    />
  </VChip>
</template>

<style lang="scss" scoped>
.copy-badge {
  text-overflow: ellipsis;
}
</style>
