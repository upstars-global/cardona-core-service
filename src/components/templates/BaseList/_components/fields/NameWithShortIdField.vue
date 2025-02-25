<script lang="ts" setup>
import NameWithIdField from './NameWithIdField.vue'

defineProps<{
  item: object
  getUpdateRoute?: (item: Record<string, any>) => Location
  getDetailsRoute?: (item: Record<string, any>) => Location
  isShowYou?: boolean
}>()
</script>

<template>
  <NameWithIdField
    :item="item"
    :get-update-route="getUpdateRoute"
    :get-details-route="getDetailsRoute"
    :is-show-you="isShowYou"
    is-short
  >
    <slot />
  </NameWithIdField>
</template>
