<script lang="ts" setup>
import CopyField from './CopyField.vue'

defineProps<{ value: string }>()
</script>

<template>
  <CopyField
    :value="value"
    is-short
  />
</template>
