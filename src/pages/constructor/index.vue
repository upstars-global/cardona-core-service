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
import I18nJsonGenerator from '@/pages/constructor/_components/I18nJsonGenerator.vue'

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

function getI18nKeys(fields: ParsedField[], prefix: string): string[] {
  return fields
    .filter(f => !f.readonly)
    .flatMap(f => {
      const base = `page.${prefix}.${f.name}`
      const keys = [base]
      if (f.extra?.placeholder)
        keys.push(`${base}Placeholder`)
      if (f.extra?.info)
        keys.push(`${base}Info`)

      return keys
    })
}

const isAutoGeneration = ref(false)

const parseAndUpdate = () => {
  parseCode()
  updateCode()
}
</script>

<template>
  <div>
    <VToolbar
      :color="VColors.Primary"
      title="🧩 Конструктор класу"
    />
    <I18nJsonGenerator :keys="getI18nKeys(parsedFields, i18nPrefix)" />
    <div class="pa-6">
      <VRow
        align="start"
        justify="space-between"
        dense
      >
        <!-- LEFT SIDE — Керування -->
        <VCol
          cols="12"
          md="6"
        >
          <!-- Вхідні дані -->
          <VCard
            class="mb-6"
            elevation="1"
          >
            <VCardTitle>1. Вставте TypeScript інтерфейс</VCardTitle>
            <VCardText>
              <VTextarea
                v-model="code"
                rows="10"
                label="TypeScript interface"
                hint="Очікується інтерфейс типу: interface IMetaData { ... }"
                persistent-hint
                class="mb-4"
              />
              <I18nPrefixEditor
                v-model="i18nPrefix"
                class="mb-4"
              />
              <div class="d-flex align-center justify-space-between">
                <VBtn
                  color="primary"
                  @click="parseAndUpdate"
                >
                  🔍 Розпарсити
                </VBtn>
                <VCheckbox
                  v-model="isAutoGeneration"
                  label="Автооновлення коду"
                  class="ml-4"
                  @update:model-value="(value) => { value ? parseAndUpdate() : null }"
                />
              </div>
            </VCardText>
          </VCard>

          <!-- Поля -->
          <VCard
            v-if="parsedFields.length"
            elevation="1"
          >
            <VCardTitle>
              2. Редагування полів
              <span class="text-grey ml-2">({{ parsedFields.length }} полів)</span>
            </VCardTitle>

            <VCardText>
              <FieldCard
                v-for="(field, i) in parsedFields"
                :key="i"
                :field="field"
                :i18n-prefix="i18nPrefix"
                :VALIDATION_RULES="VALIDATION_RULES"
                :RULES_WITH_PARAMS="RULES_WITH_PARAMS"
                class="mb-4"
              />
            </VCardText>

            <VCardActions class="d-flex justify-end">
              <VBtn
                v-if="!isAutoGeneration"
                color="primary"
                @click="updateCode"
              >
                🚀 Згенерувати код вручну
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>

        <!-- RIGHT SIDE — Код -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            v-if="output"
            elevation="1"
          >
            <VCardTitle>
              3. Згенерований клас
              <span class="text-grey ml-2">({{ className }})</span>
            </VCardTitle>
            <VCardText>
              <pre class="code-output">{{ output }}</pre>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
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
  font-size: 0.9rem;
  min-height: 400px;
}
</style>
