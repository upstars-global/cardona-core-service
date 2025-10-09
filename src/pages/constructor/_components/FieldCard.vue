<script setup lang="ts">
import { watch } from 'vue'
import { VColors } from '../../../@model/vuetify'
import { applyConfigOptions, convertToBase, convertToRaw, syncConfigOptions } from '../_composables/useFields'
import type { ParsedField } from '../types'
import { byClass as fieldConfigsByClass } from '../fieldConfigs'
import ValidationRulesEditor from './ValidationRulesEditor.vue'
import { FIELD_OPTIONS } from '@/pages/constructor/constants'

const props = defineProps<{
  field: ParsedField
  i18nPrefix: string
  VALIDATION_RULES: string[]
  RULES_WITH_PARAMS: string[]
}>()

watch(
  () => props.field.className,
  newClass => {
    if (!newClass || props.field.isRaw)
      return

    const cfg = fieldConfigsByClass[newClass]
    if (!cfg)
      return

    applyConfigOptions(props.field, cfg.options || {}, cfg.configParams)
    syncConfigOptions(props.field, props.i18nPrefix)
  },
)

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
          :items="FIELD_OPTIONS"
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
        <!-- базові -->

        <template
          v-for="key in fieldConfigsByClass[field.className]?.i18nKeys || []"
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

        <ValidationRulesEditor
          v-if="field.extra?.validationRules"
          :field="field"
          :VALIDATION_RULES="VALIDATION_RULES"
          :RULES_WITH_PARAMS="RULES_WITH_PARAMS"
          :i18n-prefix="i18nPrefix"
        />
        <!-- динамічні boolean з конфігів (наприклад, clearfix) -->
        <div
          v-for="(val, key) in field.extra"
          :key="key"
        />
      </div>
      <div
        v-for="param in fieldConfigsByClass[field.className]?.configParams || []"
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
    </div>
  </div>
</template>
