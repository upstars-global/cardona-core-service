<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
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
import ConstructorPanel from './_components/ConstructorPanel.vue'
import OrderBlocks from './_components/OrderBlocks.vue'
import FlexModeBlocks from './_components/FlexModeBlocks.vue'
import { useCopyWithToast } from '@/pages/constructor/_composables/copyWithToast'

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

watch(parsedFields, () => {
  if (isAutoGeneration.value)
    updateCode()
}, { deep: true })

const blocks = ref([
  { name: IconsList.BrandTypescript, order: 1 },
  { name: IconsList.SettingsIcon, order: 2 },
  { name: IconsList.CodeIcon, order: 3 },
])

const getOrder = (name: string) => blocks.value.find(b => b.name === name)?.order
const flexMode = ref('row')
const copyWithToast = useCopyWithToast()
</script>

<template>
  <div>
    <VToolbar
      :color="VColors.Primary"
      title="🧩 Конструктор класу"
      class="mb-4"
    >
      <template #append>
        <div class="mr-4">
          <FlexModeBlocks v-model="flexMode" />
        </div>
        <div class="mr-8">
          <OrderBlocks v-model="blocks" />
        </div>
        <VBtn
          :color="VColors.White"
          :variant="VVariants.Outlined"
          @click="localizationDrawerState = !localizationDrawerState"
        >
          Update localization keys
        </VBtn>
      </template>
    </VToolbar>

    <!-- Bottom drawer -->
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
            <span class="text-h6">Update localization keys</span>
            <VBtn
              :icon="IconsList.XIcon"
              @click="localizationDrawerState = false"
            />
          </div>
        </VCardTitle>
        <I18nJsonGenerator :keys="getI18nKeys(parsedFields, i18nPrefix)" />
      </VCard>
    </VNavigationDrawer>
    <div
      class="d-flex gap-4"
      :class="`flex-${flexMode}`"
    >
      <!-- Left: Interface -->
      <div
        class=" area-interface"
        :style="`order: ${getOrder(IconsList.BrandTypescript)}`"
      >
        <ConstructorPanel :icon="IconsList.BrandTypescript">
          <VCardText>
            <VTextarea
              v-model="code"
              rows="10"
              label="TypeScript interface"
              hint="An interface of the form interface IMetaData { ... } is expected"
              persistent-hint
              class="mb-4"
              @update:model-value="parseAndUpdate"
            />
            <I18nPrefixEditor
              v-model="i18nPrefix"
              class="mb-4"
            />
          </VCardText>
        </ConstructorPanel>
      </div>

      <!-- Middle: Field Editor -->
      <div
        class=" area-fields"
        :style="`order: ${getOrder(IconsList.SettingsIcon)}`"
      >
        <ConstructorPanel :icon="IconsList.SettingsIcon">
          <VCardText v-if="parsedFields.length">
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
        </ConstructorPanel>
      </div>

      <!-- Right: Output -->
      <div
        class=" area-output"
        :style="`order: ${getOrder(IconsList.CodeIcon)}`"
      >
        <ConstructorPanel :icon="IconsList.CodeIcon">
          <VCardTitle v-if="editableOutput">
            <div class="d-flex align-center justify-end pr-2">
              <VBtn
                color="success"
                @click="copyWithToast(editableOutput, 'constructorCodeCopied')"
              >
                <VIcon :icon="IconsList.CopyIcon" />
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
              label="Code of Class"
              hint="This code can be edited before copying."
              persistent-hint
            />
          </VCardText>
        </ConstructorPanel>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-output {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
