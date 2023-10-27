<script setup lang="ts">
import { ref } from 'vue'
import CModal from '../../../CModal.vue'
import type { IBaseListConfig } from '../model'

interface Props {
  config: IBaseListConfig
  entityName: string
  removeModalId: string
}

interface OnCLickModalOkPayload {
  hide: Function
  commentToRemove: string
}

interface Emits {
  (event: 'onClickModalOk', payload: OnCLickModalOkPayload): void
  (event: 'onCloseModal'): void
}

defineProps<Props>()

const emits = defineEmits<Emits>()

const commentToRemove = ref()

const onClickModalOk = async (hide: Function) => {
  emits('onClickModalOk', { hide, commentToRemove: commentToRemove.value })
}

const onCloseModal = () => {
  commentToRemove.value = ''
  emits('onCloseModal')
}
</script>

<template>
  <CModal
    :id="removeModalId"
    :title="$t(`modal.remove${entityName}.title`)"
    ok-variant="danger"
    :ok-title="$t('action.remove')"
    @ok="onClickModalOk"
    @hidden="onCloseModal"
  >
    <span>{{ $t(`modal.remove${entityName}.description`) }} </span>

    <BFormGroup
      v-if="config.withRemoveComment"
      class="mt-1 mb-0"
      label-for="removeComment"
      :label="$t('common.comment._')"
    >
      <BFormTextarea
        id="removeComment"
        v-model.trim="commentToRemove"
        no-resize
        rows="3"
        :placeholder="$t('common.comment._')"
      />
    </BFormGroup>
  </CModal>
</template>
