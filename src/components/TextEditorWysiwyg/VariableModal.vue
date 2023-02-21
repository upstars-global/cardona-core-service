<template>
  <b-modal
    id="variable-modal"
    ref="refModal"
    v-model="modalShow"
    :title="$t('common.banners.variableTitle')"
    size="md"
    centered
    hide-footer
  >
    <b-row>
      <div class="col-4">
        <b-badge class="variable-box" variant="light-secondary">
          {{ '{' + keyVar + '}' }}
        </b-badge>
      </div>
      <div class="col-8">
        <b-row
          v-for="itemKey in Object.keys(formModal)"
          :key="itemKey"
          class="flex-nowrap align-items-center justify-content-end mb-1"
        >
          <div class="col-2 font-small-3">{{ itemKey }}</div>
          <div class="col-10">
            <b-form-input v-model="formModal[itemKey]" :placeholder="$t('common.banners.empty')" />
          </div>
        </b-row>
      </div>
    </b-row>

    <footer class="modal-footer row-footer justify-content-between px-0">
      <button type="button" class="btn btn-outline-danger m-0" @click="deleteForm">
        {{ $t('action.remove') }}
      </button>
      <div>
        <button type="button" class="btn btn-outline-secondary mr-1" @click="closed">
          {{ $t('action.cancel_2') }}
        </button>
        <button type="button" class="btn btn-primary" @click="save">
          <div class="d-flex justify-content-center align-items-center">
            <span>{{ $t('action.save') }}</span>
          </div>
        </button>
      </div>
    </footer>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent, nextTick, watch, ref } from 'vue'

export default defineComponent({
  name: 'VariableModal',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    keyVar: {
      type: String,
      default: '',
    },
  },
  emits: ['update-value', 'close-modal', 'delete-key'],
  setup(props, { emit }) {
    const modalShow: any = ref(false)
    const refModal: any = ref(null)
    const formModal = ref(props.value)

    const closed = () => {
      nextTick(() => {
        refModal.value?.hide()
      })
    }
    watch(modalShow, (val) => {
      if (!val) {
        emit('close-modal')
      }
    })
    const save = () => {
      emit('update-value', formModal.value)
      nextTick(() => {
        refModal.value?.hide()
      })
    }
    const deleteForm = () => {
      emit('delete-key')
      nextTick(() => {
        refModal.value?.hide()
      })
    }
    return {
      formModal,
      refModal,
      modalShow,
      closed,
      save,
      deleteForm,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/core/colors/palette-variables.scss';
.variable-box {
  margin-top: 0.571rem;
}
</style>
