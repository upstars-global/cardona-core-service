<script setup lang="ts">
import { FIELD_OPTIONS } from '../../constants'
import type { ParsedField } from '../../types'
import { VColors } from '../../../../@model/vuetify'

const props = defineProps<{ field: ParsedField }>()
</script>

<template>
  <div class="flex-grow-1 pr-4 border-right">
    <div class="d-flex align-center mb-2">
      <VChip
        :color="field.isRaw ? VColors.Secondary : VColors.Warning"
        class="my-2 mr-2"
      >
        {{ field.name }}
      </VChip>
      <VSelect
        v-if="!field.readonly && !field.isRaw"
        v-model="field.className"
        :items="FIELD_OPTIONS"
      />
    </div>
    <div
      v-for="(value, key) in field.args"
      :key="key"
      class="d-flex align-center mb-2"
    >
      <VChip
        label
        :color="VColors.Info"
        class="mr-2"
      >
        {{ key }}
      </VChip>
      <div>{{ value }}</div>
    </div>
  </div>
</template>
