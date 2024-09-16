<script setup lang="ts">
import { type TranslateResult } from 'vue-i18n'
import { ModalSizes, VColors, VVariants } from '@/@model/vuetify'

defineProps<{
  modalId: string
  title: TranslateResult
  description: TranslateResult
  actionBtnText: TranslateResult
}>()

defineEmits<{
  confirmed: [hide: Function]
}>()
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="title"
    :size="ModalSizes.Small"
    centered
  >
    <template #default="{ action }">
      <p class="px-6 mb-2">
        {{ description }}
      </p>

      <hr class="my-4">

      <div class="px-6 pb-4 d-flex justify-end">
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          class="mr-4"
          @click="action.hide"
        >
          {{ $t('common.cancel') }}
        </VBtn>

        <VBtn
          :color="VColors.Error"
          @click="$emit('confirmed', action.hide)"
        >
          {{ actionBtnText }}
        </VBtn>
      </div>
    </template>
  </BaseModal>
</template>
