<script lang="ts" setup>
import { inject, ref } from 'vue'

import { VColors, VVariants } from '../../@model/vuetify'
import AppTextField from '../../@core/components/app-form-elements/AppTextField.vue'
import BaseModal from '../../components/BaseModal/index.vue'

type Value = Record<string, unknown>
interface Props {
  modalId: string
  value: Value
  keyVar: string
}

interface Emits {
  (event: 'update-value', payload: Value): void
  (event: 'close-modal'): void
  (event: 'delete-key'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const formModal = ref(props.value)
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
    @hide="onHideModal"
  >
    <VCard
      class="w-100 pa-4"
      style="min-width: 31.25rem"
    >
      <VRow class="w-100">
        <VCol class="col-4">
          <VChip
            label
            class="variable-box"
            :color="VColors.Secondary"
          >
            {{ `{ ${keyVar} }` }}
          </VChip>
        </VCol>
        <VCol cols="8">
          <VRow
            v-for="itemKey in Object.keys(formModal)"
            :key="itemKey"
            class="flex-nowrap align-center justify-content-end mb-1"
          >
            <VCol class="font-small-3">
              {{ itemKey }}
            </VCol>
            <VCol cols="10">
              <AppTextField
                v-model="formModal[itemKey]"
                :placeholder="$t('common.banners.empty')"
              />
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <footer class="d-flex align-center justify-space-between">
        <div>
          <VBtn
            type="button"
            :variant="VVariants.Outlined"
            :color="VColors.Error"
            class="m-0"
            @click="deleteForm"
          >
            {{ $t('action.remove') }}
          </VBtn>
        </div>
        <div>
          <VBtn
            type="button"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            class="mr-2"
            @click="closed"
          >
            {{ $t('action.cancel_2') }}
          </VBtn>
          <VBtn
            type="button"
            :color="VColors.Primary"
            @click="save"
          >
            <div class="d-flex justify-content-center align-center">
              <span>{{ $t('action.save') }}</span>
            </div>
          </VBtn>
        </div>
      </footer>
    </VCard>
  </BaseModal>
</template>

<style lang="scss" scoped>
.variable-box {
  margin-top: 0.571rem;
}
</style>
