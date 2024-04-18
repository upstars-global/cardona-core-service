<script lang="ts" setup>
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'

const props = defineProps<{
  modelValue: any
  disabled: boolean
}>()
</script>

<template>
  <VCard>
    <template #title>
      {{ $t('title.seo') }}
    </template>

    <VCardText>
      <VRow class="mb-2">
        <VCol cols="4">
          <FieldGenerator
            v-model="modelValue.metaTitle"
            :disabled="disabled"
            data-at="metaTitle"
          />
        </VCol>
      </VRow>

      <VRow class="mb-2">
        <VCol md="4">
          <FieldGenerator
            v-model="modelValue.metaDescription"
            :disabled="disabled"
            data-at="metaDescription"
          />
        </VCol>
      </VRow>

      <VRow class="mb-2">
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
