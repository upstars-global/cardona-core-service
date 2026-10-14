<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VColors, VVariants } from '../../../@model/vuetify'

const { locale } = useI18n()

const languages = [
  { label: 'EN', value: 'en' },
  { label: 'FR', value: 'fr' },
  { label: 'AR', value: 'ar' },
  { label: 'UK', value: 'uk' },
]
</script>

<template>
  <VBtnGroup density="compact">
    <VBtn
      v-for="lang in languages"
      :key="lang.value"
      :variant="locale === lang.value ? VVariants.Tonal : VVariants.Outlined"
      :color="locale === lang.value ? VColors.Primary : undefined"
      @click="locale = lang.value"
    >
      {{ lang.label }}
    </VBtn>
  </VBtnGroup>
</template>
