<script lang="ts" setup>
import { ref, watch } from 'vue'
import { transformFormData } from '../../../helpers'
import { SeoForm } from '../../../@model/seo'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'

const props = defineProps<{
  value: any
  disabled: boolean
}>()

const form = ref<SeoForm>({} as SeoForm)

watch(
  () => props.value,
  () => {
    // @ts-expect-error
    form.value = new SeoForm(props?.value)

    Object.keys(form.value).forEach(key => {
      if (form.value?.[key].hasOwnProperty('form'))
        form.value[key].form = props.value
    })
  },
  { immediate: true, deep: true },
    )

const onInput = val => {
  if (val?.form?.localisationParameters)
    props!.value.localisationParameters = val.form.localisationParameters

  props!.value.seo = transformFormData(form.value)
}
</script>

<template>
  <VCard>
    <VCardText>
      {{ $t('title.seo') }}
    </VCardText>

    <VCardText>
      <VRow class="mb-2">
        <VCol cols="4">
          <FieldGenerator
            v-model="form.metaTitle"
            :disabled="disabled"
            data-at="metaTitle"
            @input="onInput"
          />
        </VCol>
      </VRow>

            <VRow class="mb-2">
              <VCol md="4">
                <FieldGenerator
                  v-model="form.metaDescription"
                  :disabled="disabled"
                  data-at="metaDescription"
                  @input="onInput"
                />
              </VCol>
            </VRow>

      <VRow class="mb-2">
        <VCol>
          <FieldGenerator
            v-model="form.description"
            :disabled="disabled"
            data-at="description"
            @input="onInput"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
