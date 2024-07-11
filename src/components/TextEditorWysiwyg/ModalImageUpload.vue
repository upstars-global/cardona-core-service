<template>
  <b-modal
    id="modalImageUpload"
    ref="modalImageUpload"
    class="pb-1"
    hide-footer
    centered
    size="lg"
    :title="$t('uploadImg.selectImage')"
  >
    <file-gallery :url-file="value" :path="path" @input="setUrlFile" @inputPath="setPathFile" />
  </b-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FileGallery from '../UploadImage/FileGallery.vue'

export default defineComponent({
  name: 'ModalImageUpload',
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
    isLoad: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'setPath', 'uploadFileEvent', 'insert'],

  setup(props, { emit }) {
    const modalImageUpload: any = ref(null)

    const setUrlFile = (val) => {
      // console.log(val)
      // console.log(val.split('/')[-1])
      // emit('insert', { publicPath: val, fileName: val.split('/')[-1] })
    }
    const setPathFile = (val) => {
      emit('insert', { publicPath: val, fileName: val.split('/')[-1] })

      hideModal()
    }

    const hideModal = () => {
      modalImageUpload.value.hide()
    }

    return {
      modalImageUpload,
      setUrlFile,
      setPathFile,
      hideModal,
    }
  },
})
</script>

<style lang="scss">
</style>
