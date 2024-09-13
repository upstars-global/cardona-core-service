<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  state: boolean
}>()

const { t } = useI18n()
const badgeVariant = computed(() => (props.state ? 'success' : 'error'))
const badgeLabel = computed(() => (props.state ? t('common.yes') : t('common.no')))
</script>

<template>
  <VChip
    class="custom-badge"
    data-test-id="statement-badge"
    label
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
