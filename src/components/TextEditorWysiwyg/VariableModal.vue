<script lang="ts" setup>
import { inject, ref } from 'vue'
import { ModalSizes, VColors, VVariants } from '../../@model/vuetify'
import AppTextField from '../../@core/components/app-form-elements/AppTextField.vue'
import BaseModal from '../../components/BaseModal/index.vue'
import VariableGiftPreset from './VariableGiftPreset.vue'

type Value = Record<string, unknown>
interface Props {
  modalId: string
  value?: Value
  keyVar: string
  disabled: boolean
  currencies?: string[]
}

interface Emits {
  (event: 'update-value', payload: Value): void
  (event: 'close-modal'): void
  (event: 'delete-key'): void
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({}),
  currencies: () => [],
})

const emit = defineEmits<Emits>()

const initFormModal = (): Value => {
  const existing = props.value ?? {}
  if (!props.currencies?.length)
    return { ...existing }
  const result: Value = {}

  props.currencies.forEach(currency => {
    result[currency] = currency in existing ? existing[currency] : ''
  })

  return result
}

const formModal = ref(initFormModal())
const modal = inject('modal')

const closed = () => {
  modal.hideModal(props.modalId)
}

const onHideModal = () => {
  emit('close-modal')
}

const save = () => {
  emit('update-value', formModal.value)
  modal.hideModal(props.modalId)
}

const deleteForm = () => {
  emit('delete-key')
  modal.hideModal(props.modalId)
}
</script>

<!-- TODO: refactor sizes -->
<template>
  <BaseModal
    :id="modalId"
    :title="$t('common.banners.variableTitle')"
    :width="ModalSizes.Medium"
    modal-body-class="pa-0"
    @hide="onHideModal"
  >
    <template #modal-header="{ title }">
      <div class="d-flex align-center">
        <div class="text-h5">
          {{ title }}
        </div>
        <div class="pl-2">
          <VChip
            label
            class="variable-box"
            :color="VColors.Secondary"
          >
            {{ `{${keyVar}` + '}' }}
          </VChip>
        </div>
      </div>
    </template>
    <div class="full-width variable-modal">
      <div class="pa-6">
        <VariableGiftPreset />
        <VRow class="full-width flex-nowrap">
          <VCol
            cols="12"
            class="mb-3 pr-0"
          >
            <VRow
              v-for="itemKey in Object.keys(formModal)"
              :key="itemKey"
              class="flex-nowrap align-center justify-content-end"
            >
              <VCol class="font-small-3">
                {{ itemKey }}
              </VCol>
              <VCol
                cols="11"
                class="pr-0"
              >
                <AppTextField
                  v-model="formModal[itemKey]"
                  :disabled="disabled"
                  placeholder="0.00"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </div>

      <hr class="ma-0">

      <footer
        class="d-flex align-center py-4 px-6 "
        :class="disabled ? 'justify-end' : 'justify-space-between'"
      >
        <VBtn
          v-if="!disabled"
          type="button"
          :variant="VVariants.Outlined"
          :color="VColors.Error"
          class="m-0"
          @click="deleteForm"
        >
          {{ $t('action.remove') }}
        </VBtn>

        <div>
          <VBtn
            type="button"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            @click="closed"
          >
            {{ $t('action.cancel_2') }}
          </VBtn>

          <VBtn
            v-if="!disabled"
            type="button"
            class="ml-4"
            :color="VColors.Primary"
            @click="save"
          >
            <div class="d-flex justify-content-center align-center">
              <span>{{ $t('action.save') }}</span>
            </div>
          </VBtn>
        </div>
      </footer>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
//.variable-box {
//  margin-bottom: 0.571rem;
//}

.variable-modal {
  min-width: 31.25rem;

  :deep(.v-chip__content) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
</style>
