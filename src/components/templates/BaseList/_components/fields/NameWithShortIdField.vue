<script lang="ts" setup>
import NameWithIdField from './NameWithIdField.vue'

withDefaults(
  defineProps<{
    item: object
    getUpdateRoute?: Function
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
    :is-show-you="isShowYou"
    is-short
  >
    <slot />
  </NameWithIdField>
</template>
