<script lang="ts" setup>
import CopyField from './CopyField.vue'

defineProps<{ value: string }>()
</script>
<template>
  <copy-field :value="value" is-short />
</template>