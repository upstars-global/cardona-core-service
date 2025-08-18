<script setup lang="ts">
import { computed, inject } from 'vue'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'
import { i18n } from '../../../../plugins/i18n'
import { ModalsId } from '../../../../@model/modalsId'
import ConfirmModal from '../../../../../src/components/BaseModal/ConfirmationModal.vue'
import { MultipleActions } from '../../../../@model/enums/multipleActions'

interface Props {
  action?: MultipleActions
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
const isToggleStatus = computed(() => !props.action || props.action === MultipleActions.ToggleStatus)
const isRemove = computed(() => !props.action || props.action === MultipleActions.Remove)

const modal = inject('modal')

const multipleRemoveTitle = computed(() => props.numberSelectedItems > 1 ? i18n.t(`modal.remove${props.entityName}.titleMultiple`) : i18n.t(`modal.remove${props.entityName}.title`))
const multipleRemoveDescription = computed(() => props.numberSelectedItems > 1 ? i18n.t(`modal.remove${props.entityName}.descriptionMultiple`) : i18n.t(`modal.remove${props.entityName}.description`))

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
          v-if="isToggleStatus"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          data-test-id="activate"
          @click="emits('on-activate')"
        >
          {{ $t('action.activate') }}
        </VBtn>

        <VBtn
          v-if="isToggleStatus"
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          data-test-id="deactivate"
          @click="emits('on-deactivate')"
        >
          {{ $t('action.deactivate') }}
        </VBtn>

        <VBtn
          v-if="canRemove && isRemove"
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
