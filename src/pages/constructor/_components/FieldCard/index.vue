<script setup lang="ts">
import { watch } from 'vue'
import { applyConfigOptions, syncConfigOptions } from '../../_composables/useFields'
import { byClass as fieldConfigsByClass } from '../../fieldConfigs'
import type { ParsedField } from '../../types'
import ValidationRulesEditor from './ValidationRulesEditor.vue'
import FieldInfoBlock from './FieldInfoBlock.vue'
import RawToggle from './RawToggle.vue'
import I18nCheckboxes from './I18nCheckboxes.vue'
import DynamicConfigInputs from './DynamicConfigInputs.vue'

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
    <FieldInfoBlock :field="field" />
    <div style="min-width: 320px;">
      <RawToggle
        :field="field"
        :i18n-prefix="i18nPrefix"
      />
      <div v-if="field.extra">
        <I18nCheckboxes
          :field="field"
          :i18n-prefix="i18nPrefix"
        />
        <ValidationRulesEditor
          v-if="field.extra.validationRules"
          :field="field"
          :VALIDATION_RULES="VALIDATION_RULES"
          :RULES_WITH_PARAMS="RULES_WITH_PARAMS"
          :i18n-prefix="i18nPrefix"
        />
        <DynamicConfigInputs
          :field="field"
          :i18n-prefix="i18nPrefix"
        />
      </div>
    </div>
  </div>
</template>
