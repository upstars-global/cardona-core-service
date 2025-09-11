<script setup lang="ts">
import { ref, watch } from 'vue'
import { VColors } from '../../@model/vuetify'
import { parseInterfaceToClass } from './_composables/useFieldParser'
import * as fieldConfigs from './fieldConfigs'
import { updateExtras } from './_composables/useFields'
import { generateCode } from './_composables/useCodeGenerator'
import type { ParsedField } from './types'

import FieldCard from './_components/FieldCard.vue'
import I18nPrefixEditor from './_components/I18nPrefixEditor.vue'

defineOptions({ name: 'Constructor' })

const VALIDATION_RULES = ['required', 'email', 'min', 'max', 'regex', 'between']
const RULES_WITH_PARAMS = ['min', 'max', 'regex', 'between']

const code = ref(`interface IMetaData {
  id?: string
  title: string
  description: string
}`)

const parsedFields = ref<ParsedField[]>([])
const className = ref('MetaForm')
const output = ref('')
const i18nPrefix = ref('meta')

function parseCode() {
  parsedFields.value = parseInterfaceToClass(code.value, fieldConfigs, {
    returnParsedFields: true,
  }) as ParsedField[]
}

watch(i18nPrefix, newPrefix => {
  parsedFields.value.forEach(field => {
    if (!field.readonly && field.args.label?.startsWith('i18n.t')) {
      field.args.label = `i18n.t('page.${newPrefix}.${field.name}')`
      updateExtras(field, newPrefix)
    }
  })
})

function updateCode() {
  output.value = generateCode(parsedFields.value, className.value)
}

const isAutoGeneration = ref(false)

watch(() => parsedFields.value, (value) => {
  if (!isAutoGeneration.value) return
  updateCode()
}, { deep: true })
</script>

<template>
  <div>
    <VToolbar
      title="Constructor"
      :color="VColors.Primary"
    />
    <div class="pa-4">
      <!-- i18n prefix editor -->
      <I18nPrefixEditor v-model="i18nPrefix" />

      <!-- textarea -->
      <VTextarea
        v-model="code"
        rows="12"
        class="w-100 mb-4"
      />

      <VBtn
        class="mr-2"
        @click="parseCode"
      >
        Розпарсити
      </VBtn>

      <div v-if="parsedFields.length">
        <h3 class="mt-4">
          Поля
        </h3>
        <FieldCard
          v-for="(field, i) in parsedFields"
          :key="i"
          :field="field"
          :i18n-prefix="i18nPrefix"
          :VALIDATION_RULES="VALIDATION_RULES"
          :RULES_WITH_PARAMS="RULES_WITH_PARAMS"
        />
        <VCheckbox
          v-model="isAutoGeneration"
          label="Auto generation"
        />
        <VBtn
          v-if="!isAutoGeneration"
          class="mt-2"
          @click="updateCode"
        >
          Згенерувати код
        </VBtn>
        <pre class="code-output mt-4">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-output {
  background-color: #f6f8fa;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
