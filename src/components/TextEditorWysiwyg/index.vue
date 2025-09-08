<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import 'vue-froala-wysiwyg'
import type { TranslateResult } from 'vue-i18n'
import { useStore } from 'vuex'
import FroalaEditor from 'froala-editor'
import type { LocaleVariable } from '../../@model/translations'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { IconsList } from '../../@model/enums/icons'
import { copyToClipboard } from '../../helpers/clipboard'
import { useTextEditorStore } from '../../stores/textEditor'
import { ModalsIds } from '../../@model/enums/modal'
import ModalVideoUpload from './ModalVideoUpload.vue'
import baseConfig from './config'
import VariableModal from './VariableModal.vue'
import ModalImageUpload from './ModalImageUpload.vue'

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  optionsVariable: () => [],
  localisationParameters: () => ({}),
  disabled: false,
  placeholder: '', // getI18n.t('common.description') as string
  config: () => ({}),
})

const emit = defineEmits<Emits>()

interface Props {
  modelValue: string
  optionsVariable: Array<string>
  localisationParameters: LocaleVariable
  readonly placeholder?: TranslateResult
  disabled?: boolean
  config?: Record<string, unknown>
}

interface Emits {
  (event: 'update:modelValue', payload: string): void
  (event: 'update-localisation-parameters', payload: LocaleVariable): void
  (event: 'remove-variable', payload: string): void
}

const modal = inject('modal')

const store = useStore()
const textEditorStore = useTextEditorStore()

const content = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  },
})

const globalEditor = ref()
const isUpdateVar = computed(() => textEditorStore.isUpdateVar)
const variableTextBufferStore = computed(() => textEditorStore.variableTextBuffer)

const setVariableTextBuffer = params => {
  textEditorStore.setVariableTextBuffer(params)
}

const setVariableByKey = ({ key, value }) => {
  textEditorStore.setVariableByKey({ key, value })
}

const removeVariableValueByKey = key => {
  textEditorStore.removeVariableValueByKey(key)
}

watch(
  () => isUpdateVar.value,
  () => {
    if (isUpdateVar.value) {
      findNoUseVarAndDelete()
      textEditorStore.setUpdateVar(false)
    }
  },
)

const variableTextBuffer = computed({
  get: () => {
    return variableTextBufferStore.value
  },
  set: value => {
    setVariableTextBuffer(value)
  },
})

watch(
  () => variableTextBuffer,
  () => {
    emit('update-localisation-parameters', variableTextBuffer.value)
  },
  {
    deep: true,
  },
)

watch(
  () => props.localisationParameters,
  async () => {
    setVariableTextBuffer(props.localisationParameters)
  },
  { deep: true, immediate: true },
)

const variableKeySelect = ref('')
const defaultObjLocalisationParameters = {}

props.optionsVariable.forEach(item => {
  defaultObjLocalisationParameters[item] = ''
})

const selectedProject = computed(() => store.getters.selectedProject)

const selectedProjectPublicName = computed(
  () => selectedProject.value?.publicName || store.getters.selectedProject?.title,
)

const galleryModalId = 'gallery-modal'

const insertImages = ({ publicPath, fileName }: { publicPath: string; fileName: string }) => {
  nextTick(() => {
    modal.hideModal(galleryModalId)
  })

  globalEditor.value.image.insert(publicPath, true, { name: fileName, id: fileName }, '', {
    link: publicPath,
  })

  globalEditor.value.image.hideProgressBar(true)
}

FroalaEditor.DefineIcon('clear', { NAME: 'remove', SVG_KEY: 'remove' })
FroalaEditor.RegisterCommand('clear', {
  title: 'Clear HTML',
  focus: false,
  undo: true,
  refreshAfterCallback: true,
  callback() {
    this.html.set('')
    this.events.focus()
  },
})

// FroalaEditor.DefineIcon('magicIcon', { NAME: 'folder', SVG_KEY: 'imageManager' })
// FroalaEditor.RegisterCommand('magicButton', {
//   title: 'Magic',
//   icon: 'magicIcon',
// })
FroalaEditor.DefineIcon('uploadVimeo', { NAME: 'video', SVG_KEY: 'insertVideo' })
FroalaEditor.RegisterCommand('uploadVimeo', {
  title: 'Upload video to Vimeo ',
  focus: false,
  undo: false,
  refreshAfterCallback: false,
  callback() {
    const text = this.html.get(true)

    this.html.set(text)
    globalEditor.value = this
    nextTick(() => {
      modal.showModal(ModalsIds.UploadVideo)
    })
  },
})
FroalaEditor.DefineIcon('gallery', { NAME: 'folder', SVG_KEY: 'imageManager' })
FroalaEditor.RegisterCommand('gallery', {
  title: 'Gallery',
  focus: false,
  undo: false,
  refreshAfterCallback: false,
  callback() {
    const text = this.html.get(true)

    this.html.set(text)
    globalEditor.value = this
    nextTick(() => {
      modal.showModal(galleryModalId)
    })
  },
})

const config = {
  placeholderText: props.placeholder,
  events: {
    initialized() {
      globalEditor.value = this

      if (props.disabled)
        globalEditor.value.edit.off()
    },
    contentChanged() {
      if (!globalEditor.value)
        globalEditor.value = this

      const editor: any = this
      let contentChanged = editor.html.get()
      const regex = /{{(.*?)}}/g

      contentChanged = contentChanged.replace(/(\S*)}}(\s*){{/g, '{{$1}} $2{{')

      // Поиск всех переменных
      const uniqueVariables = Array.from(new Set(
        [...contentChanged.matchAll(regex)].map(([_, variableKey]) => variableKey.trim()),
      ))

      if (uniqueVariables.length > 0) {
        // Сохранение точной позиции курсора
        const selection = window.getSelection()
        let range = null
        if (selection?.rangeCount > 0)
          range = selection.getRangeAt(0).cloneRange()

        let updated = false
        let lastInsertedSpan = null

        uniqueVariables.forEach((keyVar: string) => {
          if (!keyVar)
            return

          const varFromBuffer = variableTextBuffer.value[keyVar] ?? { ...defaultObjLocalisationParameters }

          setVariableByKey({ key: keyVar, value: varFromBuffer })

          // Обновление текста без полной перерисовки
          const walker = document.createTreeWalker(editor.$el[0], NodeFilter.SHOW_TEXT, null)
          while (walker.nextNode()) {
            const node = walker.currentNode
            if (node.nodeValue?.includes(`{{${keyVar}}}`)) {
              const span = document.createElement('span')

              span.className = 'variable-box'
              span.innerHTML = `{${keyVar}}`

              const parent = node.parentNode!
              const index = node.nodeValue.indexOf(`{{${keyVar}}}`)
              const beforeText = document.createTextNode(`${node.nodeValue.slice(0, index)}\u00A0`)
              const afterText = document.createTextNode(`\u00A0${node.nodeValue.slice(index + `{{${keyVar}}}`.length)}`)

              parent.replaceChild(beforeText, node)
              parent.insertBefore(span, beforeText.nextSibling)
              parent.insertBefore(afterText, span.nextSibling)
              lastInsertedSpan = afterText // Устанавливаем курсор после переменной
              updated = true
            }
          }
        })

        if (updated) {
          textEditorStore.setUpdateVar(true)
          emit('update:modelValue', editor.html.get())
          editor.events.trigger('contentChanged') // Тригер на обновление контента
        }

        editor.$el.find('[id="isPasted"]').removeAttr('id')

        // Восстановление курсора после изменений за пределами span
        if (lastInsertedSpan) {
          const newRange = document.createRange()

          newRange.setStartAfter(lastInsertedSpan)
          newRange.setEndAfter(lastInsertedSpan)
          selection?.removeAllRanges()
          selection?.addRange(newRange)
        }
        else if (range) {
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
      else {
        updateVariableInContent(editor)
      }
    },
    'commands.after': function (command) {
      if (command === 'html')
        isCodeViewActive.value = this.codeView.isActive()
    },
    'image.beforeUpload': function (images: any[]) {
      Array.from(images).forEach(async file => {
        if (!file)
          return
        const fileName = file.name

        const _path = `/${selectedProjectPublicName.value}/upload/${fileName}`
        try {
          const { publicPath } = await store.dispatch('compostelaCore/uploadFile', {
            file,
            path: _path,
          })

          this.image.insert(publicPath, true, { name: fileName, id: fileName }, '', {
            link: publicPath,
          })

          this.image.hideProgressBar(true)
        }
        catch (e) {}
      })

      return false
    },
  },
  ...baseConfig,
  ...props.config,
}

const newVariableText = ref({})

// Данный метод нужен для обнавления переменных из текста который пришел с АПИ
// Так же обновления рания удаленых переменных после их возвращения в текст при помощи одиночной скобки '}'
const updateVariableInContent = editor => {
  const contentChanged = editor.html.get(true)

  newVariableText.value = {}
  Object.keys(variableTextBuffer.value).forEach(key => {
    const variable = `<span class="variable-box">{${key}}</span>`
    if (contentChanged.includes(variable)) {
      newVariableText.value[key] = variableTextBuffer.value[key]
      if (!variableTextBuffer.value[key]) {
        editor.selection.restore()
        editor.selection.setAfter(editor.selection.element())
        editor.selection.restore()
        editor.html.insert('&nbsp;')
      }
    }
  })
}

const findNoUseVarAndDelete = () => {
  if (!globalEditor.value)
    return
  const regex = /<span class="variable-box">\{(.*?)\}<\/span>/g

  const text = ref(globalEditor.value.html.get(true).replaceAll('&nbsp;', ''))
  let match
  let isUpdateCursor = false

  while ((match = regex.exec(text.value)) !== null) {
    if (globalEditor.value && !variableTextBuffer.value[match[1]]) {
      isUpdateCursor = true
      text.value = text.value
        .replaceAll(`<span class="variable-box">{${match[1]}}</span>`, '')
        .replaceAll('&nbsp;&nbsp;', '')
    }
  }

  if (isUpdateCursor) {
    globalEditor.value.html.set(text.value)
    globalEditor.value.selection.restore()
    globalEditor.value.selection.setAfter(globalEditor.value.selection.element())
    globalEditor.value.selection.restore()
    content.value = text.value
  }
}

const variableKeyUnselect = () => {
  variableKeySelect.value = ''
}

const modalId = 'variable-modal'

const setVariableKeySelect = (key: string) => {
  variableKeySelect.value = key
  nextTick(() => {
    modal.showModal(modalId)
  })
}

const updateVariableTextByKey = val => {
  // Обнавления значения данных для переменной по ключу
  // Так же обновляем буффер
  if (!variableKeySelect.value)
    return
  setVariableByKey({ key: variableKeySelect.value, value: val })
  variableKeySelect.value = ''
}

const deleteVariableTextByKey = () => {
  if (!globalEditor.value)
    return

  const text = globalEditor.value.html
    .get(true) // Параметр true нужен для возвращения HTML вместе с положением каретки текста
    .replaceAll(`<span class="variable-box">{${variableKeySelect.value}}</span>`, '')
    .replaceAll('&nbsp;&nbsp;', '')

  globalEditor.value.html.set(text)
  content.value = text
  removeVariableValueByKey(variableKeySelect.value)
  emit('remove-variable', variableKeySelect.value)
  variableKeySelect.value = ''
  textEditorStore.setUpdateVar(true)
}

const isCodeViewActive = ref(false)

const onSaveChanges = () => {
  globalEditor.value.codeView.toggle()
  isCodeViewActive.value = false
}
</script>

<template>
  <div class="block-text-edite">
    <VariableModal
      :key="variableKeySelect"
      :value="variableTextBuffer[variableKeySelect]"
      :key-var="variableKeySelect"
      :modal-id="modalId"
      :disabled="disabled"
      @update-value="updateVariableTextByKey"
      @close-modal="variableKeyUnselect"
      @delete-key="deleteVariableTextByKey"
    />
    <ModalVideoUpload />
    <ModalImageUpload
      :modal-id="galleryModalId"
      @insert="insertImages"
    />
    <div
      class="editor-wrap"
      :class="{ disabled }"
    >
      <Froala
        v-model:value="content"
        tag="textarea"
        data-test-id="text-editor"
        :config="config"
      />

      <VBtn
        v-if="isCodeViewActive"
        :color="VColors.Primary"
        :variant="VVariants.Text"
        :size="VSizes.Small"
        class="save-changes-btn mx-4 px-3"
        @click.stop="onSaveChanges"
      >
        <VIcon
          class="mr-2"
          :icon="IconsList.DeviceFloppyIcon"
          :color="VColors.Primary"
        />

        <span>
          {{ $t('action.saveChanges') }}
        </span>
      </VBtn>
    </div>

    <div :class="{ 'd-none': Object.keys(variableTextBuffer).isEmpty }">
      <div
        :key="`block-text-edite-variable${isUpdateVar}`"
        class="d-flex flex-wrap align-center block-text-edite-variable pt-3 gap-2"
      >
        <span class="text-body-2 mr-1">
          {{ $t('common.editor.addedVariables') }}:
        </span>
        <VChip
          v-for="key in Object.keys(variableTextBuffer)"
          :key="key"
          label
          :color="VColors.Primary"
          class="tag-variable gap-4"
          @click="setVariableKeySelect(key)"
        >
          <span class="pr-1">{{ `{${key}\}` }} </span>
          <VIcon
            size="16"
            :icon="IconsList.CopyIcon"
            @click.stop="copyToClipboard(`{{${key}}}`)"
          />
        </VChip>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block-text-edite {
  .editor-wrap {
    position: relative;
    :deep(.fr-counter) {
      color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));
      font-size: 15px;
    }
    :deep(.fr-toolbar) {
      border-color: rgba(var(--v-theme-grey-900), var(--v-disabled-opacity));
    }
    :deep(.fr-newline) {
      background:  rgba(var(--v-theme-grey-900), var(--v-disabled-opacity));
    }
    :deep(.fr-box.fr-basic) {
      .fr-wrapper {
        border-color: rgba(var(--v-theme-grey-900), var(--v-disabled-opacity));
      }
    }
    :deep(.fr-second-toolbar) {
      border-color: rgba(var(--v-theme-grey-900), var(--v-disabled-opacity));
    }
    &.disabled {
      :deep(.fr-toolbar),
      :deep(.fr-element),
      :deep(.fr-second-toolbar) {
        background: rgb(var(--v-theme-grey-100));
      }
      :deep(.fr-placeholder) {
        z-index: 2;
      }
    }

    :deep(ul) {
      margin-top: 1em;
      margin-bottom: 1em;
      padding-left: 40px;
    }

    .save-changes-btn {
      position: absolute;
      bottom: 0.375rem;
      right: 0;
      z-index: 99;
    }
  }
  :deep(.variable-box) {
    background: rgba(var(--v-theme-grey-500), var(--v-badge-opacity));
    padding: 1px 0.285rem;
  }
}
</style>
