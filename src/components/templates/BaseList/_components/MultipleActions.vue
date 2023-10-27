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

    <div class="d-flex gap-1">
      <!--      TODO: refactor variant/size -->
      <VBtn
        variant="outline-secondary"
        size="sm"
        @click="emits('on-activate')"
      >
        {{ $t('action.activate') }}
      </VBtn>

      <VBtn
        variant="outline-secondary"
        @click="emits('on-deactivate')"
      >
        {{ $t('action.deactivate') }}
      </VBtn>

      <VBtn
        v-if="canRemove"
        variant="outline-danger"
        size="sm"
        @click="emits('on-remove')"
      >
        {{ $t('action.remove') }}
      </VBtn>
    </div>
  </div>
</template>
