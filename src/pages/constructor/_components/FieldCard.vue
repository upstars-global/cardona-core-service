<script setup lang="ts">
import { VColors } from '../../../@model/vuetify'
import { convertToBase, convertToRaw, updateExtras } from '../_composables/useFields'
import type { ParsedField } from '../types'
import ValidationRulesEditor from './ValidationRulesEditor.vue'

defineProps<{
  field: ParsedField
  i18nPrefix: string
  VALIDATION_RULES: string[]
  RULES_WITH_PARAMS: string[]
}>()
</script>

<template>
  <div class="mb-4 pa-2 border rounded d-flex">
    <!-- LEFT -->
    <div class="flex-grow-1 pr-4 border-right">
      <div class="d-flex align-center mb-2">
        <VChip
          :color="field.isRaw ? VColors.Secondary : VColors.Warning"
          class="my-2 mr-2"
        >
          {{ field.name }}
        </VChip>
        <VSelect
          v-if="!field.readonly && !field.isRaw"
          v-model="field.className"
          :items="['TextBaseField', 'TextareaBaseField', 'SelectBaseField']"
        />
      </div>

      <div
        v-for="(value, key) in field.args"
        :key="key"
        class="d-flex align-center mb-2"
      >
        <VChip
          label
          :color="VColors.Info"
          class="mr-2"
        >
          {{ key }}
        </VChip>
        <div>{{ value }}</div>
      </div>
    </div>

    <!-- RIGHT -->
    <div style="min-width: 320px;">
      <VCheckbox
        v-if="!field.readonly"
        v-model="field.isRaw"
        label="Raw value"
        @change="field.isRaw ? convertToRaw(field) : convertToBase(field, i18nPrefix)"
      />
      <div v-if="field.extra">
        <VCheckbox
          v-model="field.extra.placeholder"
          label="placeholder"
          @change="() => updateExtras(field, i18nPrefix)"
        />
        <VCheckbox
          v-model="field.extra.info"
          label="info"
          @change="() => updateExtras(field, i18nPrefix)"
        />
        <VCheckbox
          v-model="field.extra.validationRules"
          label="validationRules"
          @change="() => updateExtras(field, i18nPrefix)"
        />
      </div>

      <ValidationRulesEditor
        v-if="field.extra?.validationRules"
        :field="field"
        :VALIDATION_RULES="VALIDATION_RULES"
        :RULES_WITH_PARAMS="RULES_WITH_PARAMS"
        :i18n-prefix="i18nPrefix"
      />
    </div>
  </div>
</template>
