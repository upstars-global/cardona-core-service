<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type {
  FieldTranslationsLocale,
  LocaleVariable, TranslationForm,
} from '../../../@model/translations'
import {
  filterString, getExcessKeyVariable,
  getVariablesFromAllLocaleText, getVariablesFromLocale,
} from '../../../helpers/text-editor'
import TextEditorWysiwyg from '../../TextEditorWysiwyg/index.vue'
import InputTextWrapper from '../../templates/LocaleForm/_components/InputTextWrapper.vue'
import CheckField from '../../templates/FieldGenerator/_components/CheckField.vue'

interface Props {
  modelValue: TranslationForm
  form: any
  type?: string
  disabled: boolean
}

const props = withDefaults(
  defineProps<Props>(),
  {
    type: 'default',
  },
)

const emits = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

const store = useStore()

const selectEditeInput = ref('')
const selectedProject = computed(() => store.getters.selectedProject)
const mainLocale = computed<string>(() => selectedProject.value?.mainLocale || 'ru')
const allLocales = computed(() => store.getters['localeCore/allLocalesKeys'])
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variables = computed(() => store.state.textEditor.variableTextBuffer)

const isMainLocale = (locale: string): boolean => locale === mainLocale.value

const onSelectEditeInput = (item, local) => {
  if (props.disabled)
    return
  if (!isMainLocale(local))
    selectEditeInput.value = item + local
}

const cleanMetaTitle = (metaTitle: FieldTranslationsLocale, variableText: string): any => {
  const metaTitlesInLists = Object.entries(metaTitle).map(([key, value]) => [
    key,
    { ...value, value: filterString(value.value, variableText) },
  ])

  return Object.fromEntries(metaTitlesInLists)
}

const updateLocalisationParameters = (variableText: LocaleVariable): void => {
  props!.form.localisationParameters = variableText
}

const onRemoveVariables = (variable: string): void => {
  if (!variable)
    return
  if (props!.modelValue.metaTitle) {
    props!.modelValue.metaTitle = cleanMetaTitle(
      props!.modelValue.metaTitle || {},
      variable || '',
    )
  }
}

const handleVariablesChange = () => {
  const allString = getVariablesFromAllLocaleText(props!.modelValue?.metaTitle)
  if (!allString)
    return
  const localeKeyInText = getVariablesFromLocale(allString)
  const excessKeyVariable = getExcessKeyVariable(localeKeyInText, variables.value)

  props!.modelValue.metaTitle = cleanMetaTitle(
    props!.modelValue.metaTitle || {},
    excessKeyVariable || '',
  )
}

const getValue = (locale: string, key: string): string => {
  return isMainLocale(locale) ? props.form[key] ? props.form[key].value : props.form.seo[key].value : props.form.fieldTranslations[key][locale].value
}

const watchOptions = { immediate: true, deep: true }

watch(() => variables, handleVariablesChange, watchOptions)

const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)
</script>

<template>
  <VCard class="locale-tab">
    <template #title>
      {{ $t('locale.localization') }}

      <slot name="header-right" />
    </template>
    <VCardText v-if="form.fieldTranslations">
      <div
        v-for="item in Object.keys(form.fieldTranslations)"
        :key="item"
        class="local-key-block d-flex flex-column"
      >
        <template v-if="form.fieldTranslations[item]">
          <VRow
            v-for="local in Object.keys(form.fieldTranslations[item])"
            :key="item + local"
            class="row-item-field-translations mt-0 mb-3"
            :class="{ 'order-first': isMainLocale(local) }"
          >
            <VCol
              v-if="isMainLocale(local)"
              class="locale-title"
              cols="12"
            >
              <h5 class="text-h5 font-weight-bolder mr-1 text-body-1 font-weight-medium">
                {{ $t(`locale.${type}.${item}`) }}
              </h5>
            </VCol>
            <VCol
              cols="2"
              class="label-locale text-button mt-2"
            >
              <p class="text-body-1">
                {{ allLocales[local] }}
              </p>
            </VCol>
            <VCol
              cols="10"
              class="body-locale pl-0 pt-0"
            >
              <div v-if="item + local === selectEditeInput">
                <TextEditorWysiwyg
                  v-model="form.fieldTranslations[item][local].value"
                  :options-variable="allCurrencies"
                  :localisation-parameters="variableTextBufferStore"
                  :data-at="`input-${item}-${local}`"
                  @update-localisation-parameters="updateLocalisationParameters"
                  @remove-variable="onRemoveVariables"
                />
                <div
                  v-if="!isMainLocale(local)"
                  class="d-flex justify-end"
                >
                  <CheckField
                    v-model="form.fieldTranslations[item][local].disabled"
                    :field="{ label: $t('action.hide') }"
                    class="ml-auto action-hide text-body-2"
                  />
                </div>
              </div>
              <InputTextWrapper
                v-else
                :content="getValue(local, item)"
              >
                <template #default="{ childrenStyle }">
                  <div
                    class="input-text text-body-1"
                    :class="{
                      'mb-2': !isMainLocale(local),
                      'disable': isMainLocale(local) || disabled,
                    }"
                    :data-at="`text-${item}-${local}`"
                    :style="childrenStyle"
                    @click="onSelectEditeInput(item, local)"
                    v-html="getValue(local, item) || `<span class=\'span-empty\'>${$t('common.empty')}</span>`"
                  />
                </template>
                <template #footer="{ isShowButton }">
                  <div
                    class="hide-checkbox w-100 d-flex justify-end"
                    :class="{ 'is-hide-checkbox': isShowButton && isMainLocale(local) }"
                  >
                    <CheckField
                      v-if="!isMainLocale(local)"
                      v-model="form.fieldTranslations[item][local].disabled"
                      :disabled="disabled"
                      :field="{ label: $t('action.hide') }"
                      class="d-flex align-items-center text-body-2 action-hide"
                    />
                  </div>
                </template>
              </InputTextWrapper>
            </VCol>
          </VRow>
        </template>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@import "@styles/variables/_vuetify";

.action-hide {
  label {
    font-size: $typography-body-2-font-size !important;
  }
}
.locale-tab {
  .local-key-block:not(:last-child) {
    border-bottom: 1px solid rgb(var(--v-theme-grey-200));
    margin-bottom: 1.5rem;

    .row-item-field-translations {
      margin-bottom: 1rem;

      .custom-control-label {
        font-size: 0.857rem;
      }
    }
  }
  .input-text{
    width: 100%;
    min-height: 2.714rem;

    border: 1px solid rgba(var(--v-theme-on-background), var(--v-focus-opacity));
    border-radius: var(--v-border-radius);
    padding: 0.5rem 1rem;
    overflow: hidden;
    cursor: pointer;
    color: rgba(var(--v-theme-grey-900), var(--v-high-emphasis-opacity));

    &.disable {
      cursor: default;
      background: rgb(var(--v-theme-grey-100));
      color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));

      .variable-box {
        color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));
      }
    }

    p {
      margin-bottom: 0;
    }

    .variable-box {
      display: inline-block;
      background: rgba(108, 117, 125, 0.12);
      color: rgb(var(--v-theme-on-surface));
      padding: 1px 0.285rem;

    }

    ul {
      margin-top: 1em;
      margin-bottom: 1em;
      padding-left: 40px;
    }

    .span-empty {
      color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));
    }
  }

  .locale-title {
    padding-bottom: 1.325rem;
  }

  .label-locale {
    padding-top: 0.5rem;
  }

  .hide-checkbox {
    display: flex;
    align-items: center;
  }
  .is-hide-checkbox {
    margin-top: 1.75rem;
  }
}
</style>
