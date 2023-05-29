<script setup lang="ts">
import { copyToClipboard } from '../../../../helpers/clipboard'

const props = defineProps<{
  value?: string
}>()
</script>

<template>
  <div v-if="value" class="text-break copy-field">
    <span>
      {{ value }}
    </span>

    <feather-icon icon="CopyIcon" class="cursor-pointer ml-25" @click="copyToClipboard(value)" />
  </div>
</template>

<style lang="scss" scoped>
.copy-field {
  min-width: 120px;
}
</style>
