<script setup lang="ts">
import type { ParsedField } from '../../types'
import { syncConfigOptions } from '../../_composables/useFields'
import { byClass as fieldConfigs } from '../../fieldConfigs'

const props = defineProps<{ field: ParsedField; i18nPrefix: string }>()
</script>

<template>
  <template
    v-for="key in fieldConfigs[field.className]?.i18nKeys || []"
    :key="key"
  >
    <VCheckbox
      v-if="key !== 'label'"
      v-model="field.extra[key]"
      :label="key"
      class="my-1"
      @change="syncConfigOptions(field, i18nPrefix)"
    />
  </template>
</template>
