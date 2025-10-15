<script setup lang="ts">
import type { ParsedField } from '../../types'
import { updateExtras } from '../../_composables/useFields'

const props = defineProps<{
  field: ParsedField
  VALIDATION_RULES: string[]
  RULES_WITH_PARAMS: string[]
  i18nPrefix: string
}>()
</script>

<template>
  <div class="mt-2">
    <!-- Multiple rule selection -->
    <VSelect
      v-model="field.extra.selectedRules"
      :items="VALIDATION_RULES"
      multiple
      label="Validation rules"
      @update:model-value="updateExtras(field, i18nPrefix)"
    />

    <!-- Inputs for rules that require parameters -->
    <div
      v-for="rule in field.extra.selectedRules.filter(r => RULES_WITH_PARAMS.includes(r))"
      :key="rule"
      class="my-4"
    >
      <VTextField
        v-model="field.extra.rulesParams[rule]"
        :label="`Param for ${rule}`"
        @input="updateExtras(field, i18nPrefix)"
      />
    </div>
  </div>
</template>
