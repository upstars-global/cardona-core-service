<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <h4 class="text-h4 mb-6">
      {{ t('common.featureFlags._') }}
    </h4>
  </div>
</template>
