<script setup lang="ts">
interface Props {
  numberSelectedItems: number
  canRemove: boolean
}

interface Emits {
  (event: 'on-activate'): void
  (event: 'on-deactivate'): void
  (event: 'on-remove'): void
}

defineProps<Props>()

const emits = defineEmits<Emits>()
</script>

<template>
  <div class="table-settings justify-content-between">
    <span class="py-25">
      {{ $t('common.numberOfSelected', { number: numberSelectedItems }) }}
    </span>

    <div>
      <b-button variant="outline-secondary" size="sm" @click="emits('on-activate')">
        {{ $t('action.activate') }}
      </b-button>

      <b-button class="ml-1" variant="outline-secondary" size="sm" @click="emits('on-deactivate')">
        {{ $t('action.deactivate') }}
      </b-button>

      <b-button
        v-if="canRemove"
        class="ml-1"
        variant="outline-danger"
        size="sm"
        @click="emits('on-remove')"
      >
        {{ $t('action.remove') }}
      </b-button>
    </div>
  </div>
</template>
