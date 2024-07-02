<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActionType } from '../../../../../@model/enums/action'
import { ActionVariant } from '../../../../../@model/enums/action'

interface Props {
  type: ActionType
}

const props = defineProps<Props>()

const { t } = useI18n()
const badgeVariant = computed(() => ActionVariant[props.type])
const badgeLabel = computed(() => props.type && t(`action.${props.type}`))
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
