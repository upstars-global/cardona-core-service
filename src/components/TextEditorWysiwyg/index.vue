<script lang="ts" setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
import 'vue-froala-wysiwyg'
import type { TranslateResult } from 'vue-i18n'
import { useStore } from 'vuex'
import type { LocaleVariable } from '../../@model/translations'
import { VColors } from '../../@model/vuetify'
import { IconsList } from '../../@model/enums/icons'
import { copyToClipboard } from '../../helpers/clipboard'
import baseConfig from './config'
import VariableModal from './VariableModal.vue'

interface Props {
  modelValue: string
  optionsVariable: Array<string>
  localisationParameters: LocaleVariable
  readonly placeholder?: TranslateResult
  disabled?: boolean
}

interface Emits {
  (event: 'update:modelValue', payload: string): void
  (event: 'update-localisation-parameters', payload: LocaleVariable): void
  (event: 'remove-variable', payload: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  optionsVariable: () => [],
  localisationParameters: () => ({}),
  disabled: false,
  placeholder: '', // getI18n.t('common.description') as string
})

const emit = defineEmits<Emits>()

const modal = inject('modal')

const store = useStore()

const content = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const globalEditor = ref()
const isUpdateVar = computed(() => store.state.textEditor.isUpdateVar)
const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)

const setVariableTextBuffer = params => {
  store.dispatch('textEditor/setVariableTextBuffer', params)
}

const setVariableByKey = ({ key, value }) => {
  store.dispatch('textEditor/setVariableByKey', { key, value })
}

const removeVariableValueByKey = key => {
  store.dispatch('textEditor/removeVariableValueByKey', key)
}

const allowInit = ref(false)

watch(
  () => isUpdateVar.value,
  () => {
    if (isUpdateVar.value) {
      findNoUseVarAndDelete()
      store.dispatch('textEditor/setUpdateVar', false)
    }
  },
)

const variableTextBuffer = computed({
  get: () => {
    return variableTextBufferStore.value
  },
  set: val => {
    store.dispatch('textEditor/setVariableTextBuffer', val)
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

const config = {
  'placeholderText': props.placeholder,
  'events': {
    initialized() {
      globalEditor.value = this

      if (props.disabled)
        globalEditor.value.edit.off()
    },
    contentChanged() {
      if (!globalEditor.value)
        globalEditor.value = this

      const editor: any = this
      const contentChanged = editor.html.get()

      // Проверить последний символ content.value и сделать описание причины
      // {{ }} - договор по указанию переменных
      const startIndex = contentChanged.indexOf('{{')
      const endIndex = contentChanged.indexOf('}}')

      if (startIndex > -1 && endIndex > -1) {
        const keyVar = contentChanged.slice(startIndex + 2, endIndex).trim()

        // что бы была возможность указать {{ }} пустые скобки и не получить пустой переменной
        if (!keyVar)
          return

        if (variableTextBuffer.value[keyVar]) {
          // Если данные есть в буффере то забираем их оттуда
          // Используеться при возвращении переменной после удаления
          setVariableByKey({ key: keyVar, value: variableTextBuffer.value[keyVar] })
        }
        else {
          setVariableByKey({ key: keyVar, value: { ...defaultObjLocalisationParameters } })
        }

        editor.selection.save() // Сохраняем положение каретки
        editor.html.set(
          editor.html
            .get(true) // Параметр true нужен для возвращения HTML вместе с положением каретки текста
            .replace(' {{', '{{')
            .replace('}} ', '}}')
            .replace('{{', '&nbsp;<span class="variable-box">{')
            .replace('}}', '}</span>&nbsp;'),
        )
        editor.selection.restore()
        store.dispatch('textEditor/setUpdateVar', true)

        // TODO: Delete id="isPasted" in copy text html
        editor.selection.save()
        editor.html.set(editor.html.get(true).replace(/id="isPasted"/g, ''))
        editor.selection.restore()
      }
      else {
        updateVariableInContent(editor)
      }

      emit('update:modelValue', contentChanged)
    },
  },

  'image.beforeUpload': function (images: any[]) {
    images.forEach(async file => {
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

  ...baseConfig,
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

  const text = ref(globalEditor.value.html.get(true))
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
  globalEditor.value.html.set(
    globalEditor.value.html
      .get(true) // Параметр true нужен для возвращения HTML вместе с положением каретки текста
      .replaceAll(`<span class="variable-box">{${variableKeySelect.value}}</span>`, '')
      .replaceAll('&nbsp;&nbsp;', ''),
  )
  removeVariableValueByKey(variableKeySelect.value)
  emit('remove-variable', variableKeySelect.value)
  variableKeySelect.value = ''
  store.dispatch('textEditor/setUpdateVar', true)
}
</script>

<template>
  <div class="block-text-edite">
    <VariableModal
      :key="variableKeySelect"
      :value="variableTextBuffer[variableKeySelect]"
      :key-var="variableKeySelect"
      :modal-id="modalId"
      @update-value="updateVariableTextByKey"
      @close-modal="variableKeyUnselect"
      @delete-key="deleteVariableTextByKey"
    />
    <div
      class="editor-wrap"
      :class="{ disabled }"
    >
      <Froala
        v-model:value="content"
        tag="textarea"
        :config="config"
      />
    </div>

    <div :class="{ 'd-none': Object.keys(variableTextBuffer).isEmpty }">
      <div
        :key="`block-text-edite-variable${isUpdateVar}`"
        class="d-flex flex-wrap align-center block-text-edite-variable pt-1 gap-2"
      >
        <span class="font-small-3 font-weight-bolder mr-1 mb-50">
          <small><b>{{ $t('common.editor.addedVariables') }}:</b></small>
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
            size="18"
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

    &.disabled {
      :deep(.fr-toolbar),
      :deep(.fr-element),
      :deep(.fr-second-toolbar) {
        background: rgb(var(--v-theme-grey-100));
      }
    }
    :deep(ul) {
      margin-top: 1em;
      margin-bottom: 1em;
      padding-left: 40px;
    }
  }
  :deep(.variable-box) {
    background: rgba(var(--v-theme-grey-500), var(--v-badge-opacity));
    padding: 1px 0.285rem;
  }
}
</style>
