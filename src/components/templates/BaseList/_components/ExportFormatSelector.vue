<template>
  <b-dropdown variant="outline-secondary" :disabled="disabled">
    <template #button-content>
      <feather-icon icon="UploadIcon" />

      <span class="ml-50">
        {{ $t('action.export') }}
      </span>
    </template>

    <template #default>
      <b-dropdown-item v-for="(value, key) in ExportFormat" :key="value" @click="onClick(value)">
        {{ key }}
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ExportFormat } from '../model'

export default defineComponent({
  name: 'ExportFormatSelector',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['export-format-selected'],

  setup(_, { emit }) {
    const onClick = (format: string) => emit('export-format-selected', format)

    return { ExportFormat, onClick }
  },
})
</script>
