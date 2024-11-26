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
  disabled: boolean
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
    <div class="full-width pa-4 px-6 variable-modal">
      <VRow class="full-width flex-nowrap">
        <VCol cols="4">
          <VChip
            label
            class="variable-box"
            :color="VColors.Secondary"
          >
            {{ `{${keyVar}` + '}' }}
          </VChip>
        </VCol>
        <VCol
          cols="8"
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
              cols="10"
              class="pr-0"
            >
              <AppTextField
                v-model="formModal[itemKey]"
                :disabled="disabled"
                :placeholder="$t('common.banners.empty')"
              />
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <footer
        class="d-flex align-center"
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
            class="mr-2"
            @click="closed"
          >
            {{ $t('action.cancel_2') }}
          </VBtn>

          <VBtn
            v-if="!disabled"
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
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
.variable-box {
  margin-top: 0.571rem;
}

.variable-modal {
  min-width: 31.25rem;

  :deep(.v-chip__content) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
</style>
