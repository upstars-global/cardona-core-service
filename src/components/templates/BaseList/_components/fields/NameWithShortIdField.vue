<script lang="ts" setup>
import NameWithIdField from './NameWithIdField.vue'

withDefaults(
  defineProps<{
    item: object
    getUpdateRoute?: Function
    getDetailsRoute?: Function
    isShowYou?: boolean
  }>(),
  {
    getUpdateRoute: () => () => ({}),
  },
)
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
