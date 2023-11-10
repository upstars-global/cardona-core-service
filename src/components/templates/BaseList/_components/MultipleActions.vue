<script setup lang="ts">
import { VColors, VSizes, VVariants } from '@/@model/vuetify'

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
  <div class="table-settings w-100 align-center justify-space-between">
    <span class="py-25">
      {{ $t('common.numberOfSelected', { number: numberSelectedItems }) }}
    </span>

    <div class="d-flex gap-4">
      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        :size="VSizes.Small"
        @click="emits('on-activate')"
      >
        {{ $t('action.activate') }}
      </VBtn>

      <VBtn
        :variant="VVariants.Outlined"
        :color="VColors.Secondary"
        :size="VSizes.Small"
        @click="emits('on-deactivate')"
      >
        {{ $t('action.deactivate') }}
      </VBtn>

      <VBtn
        v-if="canRemove"
        :variant="VVariants.Outlined"
        :color="VColors.Error"
        :size="VSizes.Small"
        @click="emits('on-remove')"
      >
        {{ $t('action.remove') }}
      </VBtn>
    </div>
  </div>
</template>
