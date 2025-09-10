<script setup lang="ts">
import { ref, watch } from 'vue'
import { VColors } from '../../@model/vuetify'
import { parseInterfaceToClass } from './useFieldParser'
import * as fieldConfigs from './fieldConfigs'
import { convertToBase, convertToRaw, updateExtras } from './useFields'
import { generateCode } from './useCodeGenerator'
import type { ParsedField } from './types'

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
  parsedFields.value = parseInterfaceToClass(code.value, fieldConfigs, { returnParsedFields: true }) as ParsedField[]
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
</script>

<template>
  <div>
    <VToolbar
      title="Constructor"
      :color="VColors.Primary"
    />
    <div class="pa-4">
      <div class="d-flex align-center mb-4">
        <div
          class="mr-2"
          style="min-width: 200px;"
        >
          Префікс i18n
        </div>
        <VTextField
          v-model="i18nPrefix"
          placeholder="meta"
          hide-details
          density="compact"
          variant="outlined"
        />
      </div>

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
        <div
          v-for="(field, i) in parsedFields"
          :key="i"
          class="mb-4 pa-2 border rounded d-flex"
        >
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
            <div
              v-if="field.extra?.validationRules"
              class="mt-2"
            >
              <VSelect
                v-model="field.extra.selectedRules"
                :items="VALIDATION_RULES"
                multiple
                label="Rules"
                @update:model-value="updateExtras(field, i18nPrefix)"
              />
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
          </div>
        </div>
        <VBtn
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
