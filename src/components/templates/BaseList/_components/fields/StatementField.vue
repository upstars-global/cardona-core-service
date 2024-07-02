<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { computed } from 'vue'
import { VColors } from '../../../../../@model/vuetify'

const props = defineProps<{
  state?: boolean
}>()

const { t } = useI18n()
const badgeVariant = computed(() => (props.state ? VColors.Success : VColors.Error))
const badgeLabel = computed(() => (props.state ? t('common.yes') : t('common.no')))
</script>

<template>
  <VChip
    label
    class="custom-badge"
    :color="badgeVariant"
  >
    {{ badgeLabel }}
  </VChip>
</template>

<style lang="scss" scoped>
.custom-badge {
  &:deep(.badge) {
    font-size: 0.9rem;
    font-weight: 600;
  }
}
</style>
