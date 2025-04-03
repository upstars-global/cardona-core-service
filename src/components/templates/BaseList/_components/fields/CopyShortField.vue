<script lang="ts" setup>
import CopyField from './CopyField.vue'

withDefaults(
  defineProps<{ value: string | number }>(), {
    value: '',
  },
)
</script>

<template>
  <CopyField
    :value="value"
    is-short
  />
</template>
