<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import store from '../../../store'
import { SeoForm } from '../../../@model/seo'
import type {
  FieldTranslationsData,
  FieldTranslationsLocale,
  LocaleVariable,
} from '../../../@model/translations'
import {
  filterString,
  getExcessKeyVariable,
  getVariablesFromAllLocaleText,
  getVariablesFromLocale,
} from '../../../helpers/text-editor'

interface Props {
  value: any
  type: string
  disabled: boolean
}

const props = defineProps<Props>()

const selectEditeInput = ref('')
const selectedProject = computed(() => store.getters.selectedProject)
const mainLocale = computed<string>(() => selectedProject.value?.mainLocale || 'ru')
const locales = computed(() => selectedProject.value?.locales || [])
const allLocales = computed(() => store.getters['localeCore/allLocalesKeys'])
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variables = computed(() => store.state.textEditor.variableTextBuffer)

const getDefaultFieldTranslations = objForm => {
  const _defaultFieldTranslations = {}

  Object.keys(objForm).forEach(key => {
    if (objForm[key]?.isLocalization)
      _defaultFieldTranslations[key] = {}
  })
  if (objForm.hasOwnProperty('seo')) {
    const seo = new SeoForm()

    Object.keys(seo).forEach(key => {
      if (seo[key]?.isLocalization)
        _defaultFieldTranslations[key] = {}
    })
  }

  return _defaultFieldTranslations as FieldTranslationsData
}

const fieldTranslations = ref<FieldTranslationsData>(getDefaultFieldTranslations(props?.value || {}))

const localFieldAdd = newForm => {
  let isUpdate = false
  const newFieldTranslations = { ...fieldTranslations.value } as FieldTranslationsData

  Object.keys(newFieldTranslations).forEach(key => {
    const mainLocalInner: string = fieldTranslations.value[key][mainLocale.value]?.value
    const mainLocalMainForm: string = newForm[key]?.value || newForm?.seo?.[key]

    if (
      (mainLocalInner && mainLocalMainForm && mainLocalInner !== mainLocalMainForm)
          || (!mainLocalInner && mainLocalMainForm && mainLocalInner !== mainLocalMainForm)
    )
      isUpdate = true

    newFieldTranslations![key][mainLocale.value] = {
      value: newForm[key]?.value !== undefined ? newForm[key]?.value : newForm?.seo?.[key],
      disabled: false
        }

    locales.value.forEach(locale => {
      newFieldTranslations[key][locale] = {
        value: newForm?.fieldTranslations?.[key]?.[locale]?.value || '',
        disabled: newForm?.fieldTranslations?.[key]?.[locale]?.disabled
          }
    })
  })
  fieldTranslations.value = newFieldTranslations

  if (isUpdate) {
    isUpdate = false
    props!.value.fieldTranslations = fieldTranslations.value
  }
}

watch(
  () => props?.value,
  val => {
    localFieldAdd(val || {})
  },
  { immediate: true, deep: true },
    )

const onInputLocalEditor = (val, item, local) => {
  fieldTranslations.value[item][local].value = val

  // TODO emit('input', form) - not work
  props!.value.fieldTranslations = fieldTranslations.value
}

const isMainLocale = (locale: string): boolean => locale === mainLocale.value

const onSelectEditeInput = (item, local) => {
  if (props.disabled)
    return
  if (!isMainLocale(local))
    selectEditeInput.value = item + local
}

const cleanString = (inputString: string) => {
  const regex = /&nbsp;<span class="variable-box">\{[^}]*\}<\/span>/g

  return inputString.replaceAll(regex, '').replaceAll('&nbsp;&nbsp;', '')
}

const cleanMetaTitle = (metaTitle: FieldTranslationsLocale, variableText: string): any => {
  const metaTitlesInLists = Object.entries(metaTitle).map(([key, value]) => [
    key,
    { ...value, value: filterString(value.value, variableText) }
      ])

  return Object.fromEntries(metaTitlesInLists)
}

const updateLocalisationParameters = (variableText: LocaleVariable): void => {
  props!.value.localisationParameters = variableText
}

const onRemoveVariables = (variable: string): void => {
  if (!variable)
    return
  props!.value.fieldTranslations.metaTitle = cleanMetaTitle(
    props!.value.fieldTranslations.metaTitle || {},
    variable || '',
      )
}

const handleVariablesChange = () => {
  const allString = getVariablesFromAllLocaleText(props?.value?.fieldTranslations?.metaTitle || {}) || ''
  if (!allString)
    return
  const localeKeyInText = getVariablesFromLocale(allString)
  const excessKeyVariable = getExcessKeyVariable(localeKeyInText, variables.value)

  props!.value.fieldTranslations.metaTitle = cleanMetaTitle(
    props!.value.fieldTranslations.metaTitle || {},
    excessKeyVariable || '',
      )
}

const watchOptions = { immediate: true, deep: true }

watch(() => variables, handleVariablesChange, watchOptions)

</script>

<template>
  <VCard class="locale-tab">
    <VCardTitle>
      {{ $t('locale.localization') }}
      <slot name="header-right" />
    </VCardTitle>
    <VCardText v-if="fieldTranslations">
      <div
        v-for="item in Object.keys(fieldTranslations)"
        :key="item"
        class="local-key-block d-flex flex-column"
      >
        <template v-if="fieldTranslations[item]">
          <VRow
            v-for="local in Object.keys(fieldTranslations[item])"
            :key="item + local"
            class="row-item-field-translations"
            :class="{ 'order-first': isMainLocale(local) }"
          >
            <VCol
              v-if="isMainLocale(local)"
              class="locale-title"
              cols="12"
            >
              <span class="font-small-3 font-weight-bolder mr-1">
                {{ $t(`locale.${type}.${item}`) }}
              </span>
            </VCol>
            <VCol
              cols="2"
              class="label-locale"
            >
              <span>{{ allLocales[local] }}</span>
            </VCol>

            <VCol
              cols="10"
              class="body-locale pl-0"
            >
              <div v-if="item + local === selectEditeInput">
                <TextEditorWysiwyg
                  :value="fieldTranslations[item][local].value"
                  :options-variable="allCurrencies"
                  :localisation-parameters="value.localisationParameters"
                  :data-at="`input-${item}-${local}`"
                  @update-localisation-parameters="updateLocalisationParameters"
                  @input="(val) => onInputLocalEditor(val, item, local)"
                  @remove-variable="onRemoveVariables"
                />
                <div
                  v-if="!isMainLocale(local)"
                  class="d-flex justify-content-end"
                >
                  <CheckField
                    v-model="fieldTranslations[item][local].disabled"
                    :field="{ label: $t('action.hide') }"
                    class="ml-auto"
                  />
                </div>
              </div>
              <InputTextWrapper
                v-else
                :content="fieldTranslations[item][local].value"
              >
                <template #default="{ childrenStyle }">
                  <div
                    class="input-text"
                    :class="{
                      'mb-50': !isMainLocale(local),
                      'disable': isMainLocale(local) || disabled,
                    }"
                    :data-at="`text-${item}-${local}`"
                    :style="childrenStyle"
                    @click="onSelectEditeInput(item, local)"
                    v-html="
                      fieldTranslations[item][local].value
                        || `<span class=\'span-empty\'>${$t('common.empty')}</span>`
                    "
                  />
                </template>
                <template #footer="{ isShowButton }">
                  <div
                    class="hide-checkbox"
                    :class="{ 'is-hide-checkbox': isShowButton && isMainLocale(local) }"
                  >
                    <CheckField
                      v-if="!isMainLocale(local)"
                      v-model="fieldTranslations[item][local].disabled"
                      :field="{ label: $t('action.hide') }"
                      class="d-flex align-items-center"
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
//@import '../../../@core/scss/base/bootstrap-extended/_include';

.locale-tab {
  .local-key-block {
    border-bottom: 1px solid #3b405c;
    //border-bottom: 1px solid $border-color;
    margin-bottom: 1.5rem;

    .row-item-field-translations {
      margin-bottom: 1rem;

      .custom-control-label {
        //font-size: $small-font-size;
      }
    }
  }
  .input-text {
    width: 100%;
    min-height: 2.714rem;

    //border: 1px solid $border-color;
    border: 1px solid blanchedalmond;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    overflow: hidden;
    cursor: pointer;

    &.disable {
      cursor: default;
      background: #efefef;
    }

    p {
      margin-bottom: 0;
    }

    .variable-box {
      display: inline-block;
      background: rgba(108, 117, 125, 0.12);
      //color: $body-color;
      color: red;
      padding: 1px 0.285rem;
    }

    .span-empty {
      //color: $text-muted;
      color: #3b405c;
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
