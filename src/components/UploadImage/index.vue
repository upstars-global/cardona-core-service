<template>
  <div class="form-upload-file form-group mb-2" :class="{ 'form-required': isRequired, disabled }">
    <modal-file-upload
      ref="modalFileUpload"
      v-model="urlFile"
      :path="path"
      :file="file"
      :is-load="isLoad"
      @uploadFileEvent="onUploadFile"
      @setPath="onSetPath"
      @clear="clearFileModal"
    />
    <label class="d-block">{{ label }}</label>
    <div class="img-file-block" :class="size">
      <div v-if="urlFile" class="img-file-block-inner">
        <div class="img-file" :style="{ backgroundImage: `url(${urlFile})` }" />
        <div class="hover-active-block justify-content-center align-items-center">
          <b-button v-b-modal.modalFileUpload variant="secondary" class="btn-icon mr-1" size="sm">
            <feather-icon icon="UploadIcon" />
          </b-button>
          <b-button variant="danger" class="btn-icon" size="sm" @click="clearFileModal">
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </div>
      </div>
      <div
        v-if="isLoad"
        class="d-flex flex-column h-100 w-100 justify-content-center align-items-center block-load-img"
      >
        <b-spinner variant="primary" class="mb-1" />

        <p class="text-body-heading font-weight-bold mb-0">
          {{ $t('common.loading') }}
        </p>
      </div>
      <div v-else class="btn-open-modal-block d-flex align-items-center justify-content-center">
        <b-button
          v-b-modal.modalFileUpload
          variant="outline-secondary"
          size="sm"
          class="btn-open-modal"
        >
          <span class="white-space-nowrap">
            {{ textBtn }}
          </span>
          <template #file-name />
          <template #drop-placeholder>
            <div class="d-flex flex-column h-100 w-100 justify-content-center align-items-center">
              <p class="text-body-heading font-weight-bold mb-0">
                {{ $t('uploadImg.dragTextDrop') }}
              </p>
            </div>
          </template>
        </b-button>
      </div>

      <b-form-file
        ref="fileInput"
        v-model="file"
        :drop-placeholder="dropPlaceholder"
        placeholder=""
        accept="image/*"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { nextTick, computed, defineComponent, PropType, ref, watch } from 'vue'
import ModalFileUpload from '@/components/UploadImage/ModalFileUpload.vue'
import i18n from '@/libs/i18n'
import useToastService from '@/helpers/toasts'
import { useBvModal } from '@/helpers/bvModal'
import { dispatch } from '@/store'

export default defineComponent({
  name: 'UploadImage',
  components: { ModalFileUpload },
  props: {
    size: {
      type: String as PropType<'sm' | 'md'>,
      default: 'sm',
    },
    label: {
      type: String,
      default: i18n.t('uploadImg.label'),
    },
    type: {
      type: String,
      default: 'banners',
    },
    textBtn: {
      type: String,
      default: i18n.t('uploadImg.textBtn'),
    },
    dropPlaceholder: {
      type: String,
      default: i18n.t('placeholder.dropFile'),
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'inputPath'],
  setup(props, { emit }) {
    const modalFileUpload: any = ref(null)
    const maxSizeFileKB = 4194304 //4MB
    const bvModal = useBvModal()
    const isLoad = ref(false)
    const { toastError } = useToastService()
    const file = ref()
    const fileInput = ref()
    const urlFile = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    const loadFile = () => {
      fileInput.value.$el.children[0].click()
    }
    const clearFileModal = async () => {
      const abilityToRemove = await confirmRemoveModal()
      if (!abilityToRemove) return
      clearFile()
    }
    const clearFile = () => {
      emit('inputPath', '')
      emit('input', '')
      file.value = null

      //It is necessary for the work of the watcher inside when re-deleting
      nextTick(() => {
        file.value = undefined
      })
    }

    watch(file, async (file) => {
      await onUploadFile(file)
    })

    const onUploadFile = async (file) => {
      if (file) {
        if (file.size > maxSizeFileKB) {
          clearFile()

          toastError('fileSizeError', { MB: String(maxSizeFileKB / 1048576) })

          return
        }

        try {
          isLoad.value = true

          const _path = props.path + '/' + file.name.replace(/\W/g, '_')
          const { publicPath } = await dispatch('compostela/uploadFile', {
            file,
            path: _path,
          })
          emit('input', publicPath)
          emit('inputPath', _path)

          modalFileUpload.value.hideModal()
        } catch {
          await clearFile()
        } finally {
          isLoad.value = false
        }
      } else {
        emit('inputPath', '')
        emit('input', '')
      }
    }
    const onSetPath = (val) => {
      emit('inputPath', val)
    }

    const confirmRemoveModal = async () => {
      return bvModal.msgBoxConfirm(String(i18n.t('uploadImg.modalLabel.' + props.type)), {
        title: String(i18n.t('uploadImg.modalTitle.' + props.type)),
        size: 'sm',
        okVariant: 'outline-danger',
        okTitle: String(i18n.t('action.remove')),
        cancelVariant: 'primary',
        cancelTitle: String(i18n.t('action.cancel')),
        hideHeaderClose: false,
        centered: true,
      })
    }

    return {
      modalFileUpload,
      file,
      urlFile,
      fileInput,
      loadFile,
      clearFileModal,
      isLoad,
      onUploadFile,
      onSetPath,
    }
  },
})
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';
.block-load-img {
  position: absolute;
  top: 0;
  left: 0;
  background: $body-bg;
  z-index: 2;
}
.form-upload-file {
  .img-file-block {
    position: relative;

    .btn-open-modal-block {
      position: absolute;
      z-index: 2;
    }

    &.sm {
      width: 8.571rem;
      height: 8.571rem;

      .btn-open-modal-block {
        position: absolute;
        top: 0.714rem;
        left: 0.714rem;
        width: calc(100% - 1.429rem);
        height: calc(100% - 1.429rem);
        z-index: 2;
      }
    }
    &.md {
      width: 100%;
      height: 8.571rem;

      .btn-open-modal-block {
        position: absolute;
        top: 50px;
        left: 60px;
        width: calc(100% - 8.571rem);
        height: calc(100% - 7.142rem);
        z-index: 2;
      }
    }

    .img-file-block-inner {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      background: $white;
      z-index: 3;

      .img-file {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        background-size: cover;
        background-position: center;
      }

      .hover-active-block {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.6);
        z-index: 4;
      }

      &:hover .hover-active-block {
        display: flex;
      }
    }
  }

  .custom-file {
    width: 100%;
    height: 100% !important;
  }

  .custom-file-input:focus ~ .custom-file-label {
    border-color: $custom-control-border-color;
    box-shadow: none;
  }

  .custom-file-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background-image: repeating-linear-gradient(
        120deg,
        $custom-control-border-color,
        $custom-control-border-color 5px,
        transparent 5px,
        transparent 10px,
        $custom-control-border-color 10px
      ),
      repeating-linear-gradient(
        210deg,
        $custom-control-border-color,
        $custom-control-border-color 5px,
        transparent 5px,
        transparent 10px,
        $custom-control-border-color 10px
      ),
      repeating-linear-gradient(
        -60deg,
        $custom-control-border-color,
        $custom-control-border-color 5px,
        transparent 5px,
        transparent 10px,
        $custom-control-border-color 10px
      ),
      repeating-linear-gradient(
        30deg,
        $custom-control-border-color,
        $custom-control-border-color 5px,
        transparent 5px,
        transparent 10px,
        $custom-control-border-color 10px
      );
    background-size: 1px 100%, 100% 1px, 1px 100%, 100% 1px;
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;

    .form-file-text button {
      position: relative;
      z-index: 2;
    }

    &.dragging {
      background-image: repeating-linear-gradient(
          120deg,
          $primary,
          $primary 5px,
          transparent 5px,
          transparent 10px,
          $primary 10px
        ),
        repeating-linear-gradient(
          210deg,
          $primary,
          $primary 5px,
          transparent 5px,
          transparent 10px,
          $primary 10px
        ),
        repeating-linear-gradient(
          -60deg,
          $primary,
          $primary 5px,
          transparent 5px,
          transparent 10px,
          $primary 10px
        ),
        repeating-linear-gradient(
          30deg,
          $primary,
          $primary 5px,
          transparent 5px,
          transparent 10px,
          $primary 10px
        );
      background-size: 1px 100%, 100% 1px, 1px 100%, 100% 1px;
      background-position: 0 0, 0 0, 100% 0, 0 100%;
      background-repeat: no-repeat;
      z-index: 4;
    }
    input:focus {
    }

    &::after {
      display: none;
    }
  }

  &.disabled {
    pointer-events: none;

    .custom-file-label {
      background-color: $input-disabled-bg;
    }
  }
}
</style>
