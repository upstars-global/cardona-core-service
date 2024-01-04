<template>
  <div class="table-block">
    <div v-for="(value, name) in data" :key="name" class="d-flex align-items-start">
      <span class="mr-25">
        {{ `${name}:` }}
      </span>

      <span
        v-if="isEmptyString(value) || isNullOrUndefinedValue(value)"
        class="font-weight-bold text-muted"
      >
        {{ String($t('common.empty')).toLowerCase() }}
      </span>

      <span v-else class="font-weight-bold">
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmptyString, isNullOrUndefinedValue } from '../../../../helpers'

const props = defineProps<{
  data?: Record<string, string>
}>()
</script>

<style lang="scss" scoped>
.table-block {
  width: max-content;
  padding: 0.5rem 0;
}
</style>
