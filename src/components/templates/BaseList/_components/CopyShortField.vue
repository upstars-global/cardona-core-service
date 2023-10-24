<script lang="ts" setup>
import CopyField from './CopyField.vue'
import { NumberOrString } from '../../../../@model'

defineProps<{ value: NumberOrString }>()
</script>
<template>
  <copy-field :value="value" is-short />
</template>