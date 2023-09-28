<template>
  <div
    id="imagePath-field"
    class="form-upload-file form-group mb-2"
    :class="{ 'form-required': isRequired, disabled }"
  >
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
            <feather-icon :icon="IconsList.UploadIcon" />
          </b-button>
          <b-button variant="danger" class="btn-icon" size="sm" @click="clearFileModal">
            <feather-icon :icon="IconsList.Trash2Icon" />
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
import ModalFileUpload from '../UploadImage/ModalFileUpload.vue'
import i18n from '../../libs/i18n'
import useToastService from '../../helpers/toasts'
import { useBvModal } from '../../helpers/bvModal'
import store from '../../store'
import { IconsList } from '../../@model/enums/icons'

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
          const { publicPath } = await store.dispatch('compostelaCore/uploadFile', {
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
      IconsList,
    }
  },
})
</script>

<style lang="scss">
@import '../../assets/scss/components/upload';
</style>
