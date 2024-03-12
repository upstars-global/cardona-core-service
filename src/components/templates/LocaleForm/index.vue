<script setup lang="ts">
import { computed, ref } from 'vue'
import store from '../../../store'
import type {
  FieldTranslationsLocale,
  LocaleVariable,
} from '../../../@model/translations'
import {
  filterString,
} from '../../../helpers/text-editor'
import TextEditorWysiwyg from '../../TextEditorWysiwyg/index.vue'
import InputTextWrapper from '../../templates/LocaleForm/_components/InputTextWrapper.vue'

interface Props {
  modelValue: any
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

const selectEditeInput = ref('')
const selectedProject = computed(() => store.getters.selectedProject)
const mainLocale = computed<string>(() => selectedProject.value?.mainLocale || 'ru')
const allLocales = computed(() => store.getters['localeCore/allLocalesKeys'])
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])

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
  props!.modelValue.fieldTranslations.metaTitle = cleanMetaTitle(
    props!.modelValue.fieldTranslations.metaTitle || {},
    variable || '',
  )
}

const getValue = (locale: string, key: string): string => {
  return isMainLocale(locale) ? props.form[key] ? props.form[key].value : props.form.seo[key].value : props.form.fieldTranslations[key][locale].value
}
</script>

<template>
  <VCard class="locale-tab">
    <VCardTitle>
      {{ $t('locale.localization') }}
      <slot name="header-right" />
    </VCardTitle>
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
                  v-model="form.fieldTranslations[item][local].value"
                  :options-variable="allCurrencies"
                  :localisation-parameters="form.localisationParameters"
                  :data-at="`input-${item}-${local}`"
                  @update-localisation-parameters="updateLocalisationParameters"
                  @remove-variable="onRemoveVariables"
                />
                <div
                  v-if="!isMainLocale(local)"
                  class="d-flex justify-content-end"
                >
                  <CheckField
                    v-model="form.fieldTranslations[item][local].disabled"
                    :field="{ label: $t('action.hide') }"
                    class="ml-auto"
                  />
                </div>
              </div>
              <InputTextWrapper
                v-else
                :content="getValue(local, item)"
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
                    v-html="getValue(local, item) || `<span class=\'span-empty\'>${$t('common.empty')}</span>`"
                  />
                </template>
                <template #footer="{ isShowButton }">
                  <div
                    class="hide-checkbox"
                    :class="{ 'is-hide-checkbox': isShowButton && isMainLocale(local) }"
                  >
                    <CheckField
                      v-if="!isMainLocale(local)"
                      v-model="form.fieldTranslations[item][local].disabled"
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
.locale-tab {
  .local-key-block {
    border-bottom: 1px solid #3b405c;
    border-bottom: 1px solid rgb(var(--v-theme-on-background));
    margin-bottom: 1.5rem;

    .row-item-field-translations {
      margin-bottom: 1rem;

      .custom-control-label {
        font-size: 0.857rem;
      }
    }
  }
  .input-text {
    width: 100%;
    min-height: 2.714rem;

    border: 1px solid rgba(var(--v-theme-on-background), var(--v-focus-opacity));
    border-radius: var(--v-border-radius);
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
      color: rgb(var(--v-theme-on-surface));
      padding: 1px 0.285rem;
    }

    .span-empty {
      color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
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

  .input-text.disable {
    background: rgb(var(--v-theme-background));
  }
}
</style>
