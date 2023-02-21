<template>
  <b-modal
    id="modalFileUpload"
    ref="modalFileUpload"
    class="pb-1"
    hide-footer
    centered
    size="lg"
    :title="$t('uploadImg.selectImage')"
  >
    <b-tabs class="tabs-file-upload" content-class="pt-1 pb-1">
      <b-tab active :title="$t('uploadImg.downloadNew')">
        <div v-if="value" class="p-2 img-block">
          <b-button class="delete-btn" variant="outline-danger" @click="clearFile">
            {{ $t('uploadImg.delete') }}
          </b-button>

          <img :src="value" />
        </div>

        <b-form-file v-else v-model="fileInner" accept="image/*">
          <template #file-name>
            <div
              class="d-flex flex-column h-100 w-100 justify-content-center align-items-center block-load-img font-small-4"
            >
              <template v-if="isLoad">
                <b-spinner variant="primary" class="mb-1" />

                <span class="text-body-heading font-weight-bold">
                  {{ $t('common.loading') }}
                </span>
              </template>

              <template v-else-if="!isLoad && !value">
                <feather-icon icon="AlertCircleIcon" size="42" class="text-danger mb-75" />

                <span class="font-weight-bold text-danger mb-1">
                  {{ $t('uploadImg.loadError') }}
                </span>

                <b-button variant="primary">
                  {{ $t('action.repeat') }}
                </b-button>
              </template>
            </div>
          </template>

          <template #placeholder>
            <div class="d-flex flex-column h-100 w-100 justify-content-center align-items-center">
              <p class="text-body-heading font-weight-bold mb-0">
                {{ $t('uploadImg.dragText') }}
              </p>
              <p class="font-small-3">{{ $t('uploadImg.maxSize') }}</p>

              <b-button variant="primary">
                {{ $t('uploadImg.downloadDevice') }}
              </b-button>
            </div>
          </template>
          <template #drop-placeholder>
            <div class="d-flex flex-column h-100 w-100 justify-content-center align-items-center">
              <p class="text-body-heading font-weight-bold mb-0">
                {{ $t('uploadImg.dragTextDrop') }}
              </p>
              <p class="font-small-3">{{ $t('uploadImg.maxSize') }}</p>
            </div>
          </template>
        </b-form-file>
      </b-tab>
      <b-tab :title="$t('uploadImg.chooseFromDownloaded')">
        <file-gallery :url-file="value" :path="path" @input="setUrlFile" @inputPath="setPathFile" />
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { uploadFile } from '@/_@queries/сompostela'
import FileGallery from '@/components/UploadImage/FileGallery.vue'

export default defineComponent({
  name: 'ModalFileUpload',
  components: { FileGallery },
  props: {
    value: {
      type: String || null,
      required: true,
      default: '',
    },
    path: {
      type: String,
      default: '/',
    },
    file: {
      type: File,
      default: undefined,
    },
    isLoad: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'setPath', 'uploadFile', 'clear'],

  setup(props, { emit }) {
    const modalFileUpload: any = ref(null)

    const fileInner = computed({
      get: () => props.file,
      set: (value) => emit('uploadFile', value),
    })
    const setUrlFile = (val) => {
      emit('input', val)
    }
    const setPathFile = (val) => {
      emit('setPath', val)

      hideModal()
    }

    const clearFile = () => {
      emit('clear')
    }

    const hideModal = () => {
      modalFileUpload.value.hide()
    }

    return {
      modalFileUpload,
      clearFile,
      setUrlFile,
      setPathFile,
      fileInner,
      hideModal,
    }
  },
})
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';

.tabs-file-upload {
  .img-block {
    position: relative;
    width: 100%;
    height: 13.714rem;
    background: rgba(186, 191, 199, 0.12);
    border-radius: 0.5rem;

    .delete-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }
    img {
      height: 100%;
      border-radius: 0.286rem;
    }
  }
  .custom-file {
    height: 19.43rem !important;

    .custom-file-input:focus ~ .custom-file-label {
      box-shadow: none;
    }

    .custom-file-label {
      cursor: pointer;
      border: 1px solid transparent;
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

      &::after {
        display: none;
        content: '';
      }
      .form-file-text {
        height: 100%;
        width: 100%;
      }

      &.dragging {
        background: rgba(115, 103, 240, 0.08);
        border: 1px solid $purple !important;
      }
    }
  }
}
</style>
