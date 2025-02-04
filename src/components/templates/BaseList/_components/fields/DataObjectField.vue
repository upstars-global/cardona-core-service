<script setup lang="ts">
import { isEmptyString, isNullOrUndefinedValue } from '../../../../../helpers'

defineProps<{
  data?: Record<string, string>
}>()
</script>

<template>
  <div class="table-block">
    <div
      v-for="(value, name) in data"
      :key="name"
      class="d-flex align-start"
    >
      <span
        class="mr-1"
        :data-test-id="`key-${name}`"
      >
        {{ `${name}:` }}
      </span>

      <span
        v-if="isEmptyString(value) || isNullOrUndefinedValue(value)"
        class="font-weight-medium text-color-placeholder-disabled"
        :data-test-id="`empty-value-${name}`"
      >
        {{ String($t('common.empty')).toLowerCase() }}
      </span>

      <span
        v-else
        class="font-weight-medium"
        :data-test-id="`value-${name}`"
      >
        {{ value }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-block {
  width: max-content;
  padding: 0.5rem 0;
}
</style>
