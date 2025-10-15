<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { useClipboard, useResizeObserver } from '@vueuse/core'
import { VColors, VVariants } from '../../@model/vuetify'
import { IconsList } from '../../@model/enums/icons'
import { parseInterfaceToClass } from './_composables/useFieldParser'
import * as fieldConfigs from './fieldConfigs'
import { updateExtras } from './_composables/useFields'
import { generateCode } from './_composables/useCodeGenerator'
import type { ParsedField } from './types'

import FieldCard from './_components/FieldCard/index.vue'
import I18nPrefixEditor from './_components/I18nPrefixEditor.vue'
import I18nJsonGenerator from './_components/I18nJsonGenerator.vue'

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
const editableOutput = ref('')
const i18nPrefix = ref('meta')
const isAutoGeneration = ref(true)
const localizationDrawerState = ref(false)

const { copy } = useClipboard()

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
  editableOutput.value = output.value
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
      if (f.extra?.description)
        keys.push(`${base}description`)

      return keys
    })
}

const parseAndUpdate = () => {
  parseCode()
  updateCode()
}

onMounted(() => {
  parseAndUpdate()
})

watch(
  () => parsedFields.value,
  () => {
    if (isAutoGeneration.value)
      updateCode()
  },
  { deep: true },
)

const sourceInterfaceRef = useTemplateRef<HTMLElement | null>('sourceInterfaceRef')

useResizeObserver(sourceInterfaceRef, entries => {
  const entry = entries[0]
  const { width, height } = entry.contentRect

  console.log({ width, height })
})
</script>

<template>
  <div>
    <VToolbar
      :color="VColors.Primary"
      title="🧩 Конструктор класу"
      class="mb-4 bg-grey-300"
    >
      <div class="d-flex align-center justify-start flex-grow-1">
        <VBtn :variant="VVariants.Outlined">
          <VIcon :icon="IconsList.BrandTypescript" />
        </VBtn>
        <VBtn :variant="VVariants.Outlined">
          <VIcon :icon="IconsList.CodeIcon" />
        </VBtn>
        <VBtn :variant="VVariants.Outlined">
          <VIcon :icon="IconsList.LanguageKatakana" />
        </VBtn>
      </div>
      <template #append>
        <VBtn
          :color="VColors.White"
          :variant="VVariants.Outlined"
          @click="localizationDrawerState = !localizationDrawerState"
        >
          Update localization keys
        </VBtn>
      </template>
    </VToolbar>

    <VNavigationDrawer
      v-model="localizationDrawerState"
      location="bottom"
      width="500"
    >
      <VCard min-width="500">
        <VCardTitle>
          <div
            class="d-flex align-center justify-space-between"
            style="width: 100%;"
          >
            <span class="text-h6">
              Update localization keys
            </span>
            <VBtn
              :icon="IconsList.XIcon"
              @click="localizationDrawerState = false"
            />
          </div>
        </VCardTitle>
        <I18nJsonGenerator :keys="getI18nKeys(parsedFields, i18nPrefix)" />
      </VCard>
    </VNavigationDrawer>

    <div class="pa-6">
      <VRow
        align="start"
        justify="space-between"
        dense
        class="d-flex align-start align-stretch"
      >
        <!-- LEFT SIDE — Source Interface -->
        <div
          ref="sourceInterfaceRef"
          style="resize: horizontal; overflow: auto;"
          cols="12"
          md="4"
          class="flex-column flex-grow-1 d-flex"
        >
          <VCard
            elevation="1"
            class="flex-column flex-grow-1 d-flex"
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
                @update:model-value="parseAndUpdate"
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
        </div>
        <VCol
          cols="12"
          md="4"
          class="flex-column flex-grow-1 d-flex"
        >
          <VCard
            v-if="parsedFields.length"
            elevation="1"
            class="flex-column flex-grow-1 d-flex"
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

        <!-- RIGHT SIDE — Code Output -->
        <VCol
          cols="12"
          md="4"
          class="flex-column flex-grow-1 d-flex"
        >
          <VCard
            v-if="editableOutput"
            elevation="1"
            class="flex-column flex-grow-1 d-flex"
          >
            <VCardTitle>
              <div class="d-flex align-center justify-space-between">
                <span class="text-grey ml-2">3. Згенерований клас ({{ className }})</span>
                <VBtn
                  color="success"
                  @click="copy(editableOutput)"
                >
                  📋 Копіювати Class
                </VBtn>
              </div>
            </VCardTitle>
            <VCardText>
              <VTextarea
                v-model="editableOutput"
                rows="20"
                readonly
                auto-grow
                class="code-output"
                label="Код класу"
                hint="Цей код можна редагувати перед копіюванням"
                persistent-hint
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped>
.code-output {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
