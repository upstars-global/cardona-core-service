<script setup lang="ts">
import type { ParsedField } from '../../types'
import { syncConfigOptions } from '../../_composables/useFields'
import { byClass as fieldConfigs } from '../../fieldConfigs'

const props = defineProps<{ field: ParsedField; i18nPrefix: string }>()
</script>

<template>
  <div
    v-for="param in fieldConfigs[field.className]?.configParams || []"
    :key="param.key"
    class="my-2"
  >
    <VCheckbox
      v-if="param.input === 'boolean'"
      v-model="field.extra[param.key]"
      :label="param.key"
      @change="syncConfigOptions(field, i18nPrefix)"
    />
    <VSelect
      v-else-if="param.input === 'select'"
      v-model="field.extra[param.key]"
      :items="param.items"
      :label="param.key"
      @update:model-value="syncConfigOptions(field, i18nPrefix)"
    />
    <VTextField
      v-else
      v-model="field.extra[param.key]"
      :label="param.key"
      @input="syncConfigOptions(field, i18nPrefix)"
    />
  </div>
</template>
