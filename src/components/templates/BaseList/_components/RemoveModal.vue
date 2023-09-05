<script setup lang="ts">
import { ref } from 'vue'
import CModal from '../../../CModal.vue'
import { IBaseListConfig } from '../model'

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
  (event: 'on-click-modal-ok', payload: OnCLickModalOkPayload): void
  (event: 'on-close-modal'): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const commentToRemove = ref()

const onClickModalOk = async (hide: Function) => {
  emits('on-click-modal-ok', { hide, commentToRemove: commentToRemove.value })
}

const onCloseModal = () => {
  commentToRemove.value = ''
  emits('on-close-modal')
}
</script>

<template>
  <c-modal
    :id="removeModalId"
    :title="$t(`modal.remove${entityName}.title`)"
    ok-variant="danger"
    :ok-title="$t('action.remove')"
    @ok="onClickModalOk"
    @hidden="onCloseModal"
  >
    <span>{{ $t(`modal.remove${entityName}.description`) }} </span>

    <b-form-group
      v-if="config.withRemoveComment"
      class="mt-1 mb-0"
      label-for="removeComment"
      :label="$t('common.comment._')"
    >
      <b-form-textarea
        id="removeComment"
        v-model.trim="commentToRemove"
        no-resize
        rows="3"
        :placeholder="$t('common.comment._')"
      />
    </b-form-group>
  </c-modal>
</template>
