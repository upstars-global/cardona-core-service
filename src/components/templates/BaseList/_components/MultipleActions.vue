<script setup lang="ts">
import { computed, inject } from 'vue'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'
import { i18n } from '../../../../plugins/i18n'
import { ModalsId } from '../../../../@model/ModalsId'
import ConfirmModal from '../../../../../src/components/BaseModal/ConfirmationModal.vue'

interface Props {
  numberSelectedItems: number
  canRemove: boolean
  entityName: string
}

interface Emits {
  (event: 'on-activate'): void
  (event: 'on-deactivate'): void
  (event: 'on-remove'): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const modal = inject('modal')

const multipleRemoveTitle = computed(() => props.numberSelectedItems > 1 ? i18n.t(`modal.${props.entityName}.titleMultiple`) : i18n.t(`modal.${props.entityName}.title`))
const multipleRemoveDescription = computed(() => props.numberSelectedItems > 1 ? i18n.t(`modal.${props.entityName}.descriptionMultiple`) : i18n.t(`modal.${props.entityName}.description`))

const onRemove = () => {
  modal.showModal(ModalsId.MultipleRemoveList)
}
</script>

<template>
  <ConfirmModal
    :title="multipleRemoveTitle"
    :description="multipleRemoveDescription"
    :modal-id="ModalsId.MultipleRemoveList"
    :action-btn-text="i18n.t('action.remove')"
    @confirmed="emits('on-remove')"
  />
  <div class="table-settings w-100 align-center justify-space-between pa-4">
    <span data-test-id="number-selected">
      {{ $t('common.numberOfSelected', { number: numberSelectedItems }) }}
    </span>

    <div class="d-flex gap-4">
      <slot>
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          data-test-id="activate"
          @click="emits('on-activate')"
        >
          {{ $t('action.activate') }}
        </VBtn>

        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          data-test-id="deactivate"
          @click="emits('on-deactivate')"
        >
          {{ $t('action.deactivate') }}
        </VBtn>

        <VBtn
          v-if="canRemove"
          :variant="VVariants.Outlined"
          :color="VColors.Error"
          :size="VSizes.Small"
          data-test-id="remove"
          @click="onRemove"
        >
          {{ $t('action.remove') }}
        </VBtn>
      </slot>
    </div>
  </div>
</template>
