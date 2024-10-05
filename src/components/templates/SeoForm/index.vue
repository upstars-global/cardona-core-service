<script lang="ts" setup>
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import type { SeoForm } from '../../../@model/seo'

defineProps<{
  modelValue: SeoForm
  disabled?: boolean
}>()
</script>

<template>
  <VCard>
    <template #title>
      {{ $t('title.seo') }}
    </template>

    <VCardText>
      <VRow>
        <VCol cols="4">
          <FieldGenerator
            v-model="modelValue.metaTitle"
            :disabled="disabled"
            data-at="metaTitle"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol md="4">
          <FieldGenerator
            v-model="modelValue.metaDescription"
            :disabled="disabled"
            data-at="metaDescription"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <FieldGenerator
            v-model="modelValue.description"
            :disabled="disabled"
            data-at="description"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
