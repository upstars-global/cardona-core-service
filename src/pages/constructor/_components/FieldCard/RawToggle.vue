<script setup lang="ts">
import type { ParsedField } from '../../types'
import { convertToBase, convertToRaw } from '../../_composables/useFields'

const props = defineProps<{ field: ParsedField; i18nPrefix: string }>()
</script>

<template>
  <VCheckbox
    v-if="!field.readonly"
    v-model="field.isRaw"
    label="Raw value"
    @change="field.isRaw ? convertToRaw(field) : convertToBase(field, i18nPrefix)"
  />
</template>
