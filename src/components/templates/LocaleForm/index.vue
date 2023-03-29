<template>
  <b-card no-body class="locale-tab">
    <b-card-header>
      <b-card-title>
        {{ $t('locale.localization') }}
      </b-card-title>
      <slot name="header-right" />
    </b-card-header>

    <b-card-body v-if="fieldTranslations">
      <div
        v-for="item in Object.keys(fieldTranslations)"
        :key="item"
        class="local-key-block d-flex flex-column"
      >
        <template v-if="fieldTranslations[item]">
          <b-row
            v-for="local in Object.keys(fieldTranslations[item])"
            :key="item + local"
            class="row-item-field-translations"
            :class="{ 'order-first': local === mainLocale }"
          >
            <b-col md="2">
              <span v-if="local === mainLocale" class="font-small-3 font-weight-bolder mr-1">
                {{ $t('locale.' + type + '.' + item) }}
              </span>
            </b-col>
            <b-col md="3">
              <span>{{ allLocales[local] }}</span>
            </b-col>
            <b-col md="7">
              <text-editor-wysiwyg
                v-if="item + local === selectEditeInput"
                :value="fieldTranslations[item][local]"
                :options-variable="allCurrencies"
                :localisation-parameters="value.localisationParameters"
                :data-at="`input-${item}-${local}`"
                @update-localisation-parameters="updateLocalisationParameters"
                @input="(val) => onInputLocalEditor(val, item, local)"
              />
              <div
                v-else
                class="input-text"
                :class="{ disable: local === mainLocale || disabled }"
                :data-at="`text-${item}-${local}`"
                @click="onSelectEditeInput(item, local)"
                v-html="
                  fieldTranslations[item][local] ||
                  `<span class=\'span-empty\'>${$t('common.empty')}</span>`
                "
              />
            </b-col>
          </b-row>
        </template>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import TextEditorWysiwyg from '../../../components/TextEditorWysiwyg/index.vue'
import { getters } from '../../../store'
import { SeoForm } from '../../../@model/seo'
import { FieldTranslationsData } from '../../../@model/translations'

export default defineComponent({
  name: 'LocaleForm',
  components: {
    TextEditorWysiwyg,
  },
  props: {
    value: {
      type: Object as any,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['input'],

  setup(props) {
    const selectEditeInput = ref('')
    const selectedProject = computed(() => getters.selectedProject)
    const mainLocale = computed(() => selectedProject.value?.mainLocale || 'ru')
    const locales = computed(() => selectedProject.value?.locales || [])
    const allLocales = computed(() => getters['locale/allLocalesKeys'])
    const allCurrencies = computed(() => getters['appConfig/allCurrencies'])

    const getDefaultFieldTranslations = (objForm) => {
      const _defaultFieldTranslations = {}
      Object.keys(objForm).forEach((key) => {
        if (objForm[key]?.isLocalization) {
          _defaultFieldTranslations[key] = {}
        }
      })
      if (objForm.hasOwnProperty('seo')) {
        const seo = new SeoForm()
        Object.keys(seo).forEach((key) => {
          if (seo[key]?.isLocalization) {
            _defaultFieldTranslations[key] = {}
          }
        })
      }
      return _defaultFieldTranslations as FieldTranslationsData
    }
    const fieldTranslations = ref<FieldTranslationsData>(getDefaultFieldTranslations(props.value))
    const localFieldAdd = (newForm) => {
      let isUpdate: boolean = false
      let newFieldTranslations = { ...fieldTranslations.value } as FieldTranslationsData

      Object.keys(newFieldTranslations).forEach((key) => {
        const mainLocalInner: string = fieldTranslations.value[key][mainLocale.value]
        const mainLocalMainForm: string = newForm[key]?.value || newForm?.seo?.[key]

        if (
          (mainLocalInner && mainLocalMainForm && mainLocalInner !== mainLocalMainForm) ||
          (!mainLocalInner && mainLocalMainForm && mainLocalInner !== mainLocalMainForm)
        ) {
          isUpdate = true
        }

        newFieldTranslations![key][mainLocale.value] =
          newForm[key]?.value !== undefined ? newForm[key]?.value : newForm?.seo?.[key]

        locales.value.forEach((locale) => {
          newFieldTranslations[key][locale] = newForm?.fieldTranslations?.[key]?.[locale] || ''
        })
      })
      fieldTranslations.value = newFieldTranslations

      if (isUpdate) {
        isUpdate = false
        props!.value['fieldTranslations'] = fieldTranslations.value
      }
    }

    watch(
      () => props.value,
      (val) => {
        localFieldAdd(val)
      },
      { immediate: true, deep: true }
    )

    const onInputLocalEditor = (val, item, local) => {
      fieldTranslations.value[item][local] = val
      // TODO emit('input', form) - not work
      props!.value['fieldTranslations'] = fieldTranslations.value
    }

    const onSelectEditeInput = (item, local) => {
      if (props.disabled) return
      if (local !== mainLocale.value) {
        selectEditeInput.value = item + local
      }
    }

    const updateLocalisationParameters = (variableText) => {
      // TODO emit('input', form) - not work
      props!.value['localisationParameters'] = variableText
    }

    return {
      fieldTranslations,
      selectedProject,
      selectEditeInput,
      onSelectEditeInput,
      allLocales,
      mainLocale,
      allCurrencies,
      updateLocalisationParameters,
      onInputLocalEditor,
    }
  },
})
</script>
<style lang="scss">
@import '../../../@core/scss/base/bootstrap-extended/_include';

.locale-tab {
  .local-key-block {
    border-bottom: 1px solid $border-color;
    margin-bottom: 1.5rem;

    .row-item-field-translations {
      margin-bottom: 1.5rem;
    }
  }
  .input-text {
    width: 100%;
    min-height: 2.714rem;

    border: 1px solid $border-color;
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
      color: $body-color;
      padding: 1px 0.285rem;
    }

    .span-empty {
      color: $text-muted;
    }
  }
}
</style>
