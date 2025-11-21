<script setup lang="ts">
import { ref } from 'vue'
import 'vue-froala-wysiwyg'
import FroalaEditor from 'froala-editor'
import { FROALA_API_KEY } from '../libs/froala'

interface Props {
  modelValue: Record<string, unknown>
  withEditMode?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const editor = ref<FroalaEditor>({})
const code = ref<string>(JSON.stringify(props.modelValue, null, '\t'))

const froalaConfig = {
  apiKey: FROALA_API_KEY,
  key: FROALA_API_KEY,
  pluginsEnabled: ['codeView', 'codeMirror'],
  codeMirrorOptions: {
    indentWithTabs: true,
    lineNumbers: true,
    lineWrapping: true,
    mode: 'application/json',
    tabMode: 'indent',
    tabSize: 2,
  },
  toolbarButtons: {},
  enter: FroalaEditor.ENTER_BR,
  events: {
    initialized() {
      editor.value = this
      editor.value.html.set(JSON.stringify(props.modelValue, null, '\t'))
      editor.value.codeView.toggle()
    },
    'html.get': function (html: string) {
      return html.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
    },
  },
}

const apply = () => {
  editor.value.codeView.toggle()
  editor.value.codeView.toggle()
  emits('update:modelValue', JSON.parse(code.value))
}
</script>

<template>
  <div
    class="code-view-editor"
    :class="{ 'code-view-editor--edit-mode': withEditMode }"
  >
    <Froala
      v-model:value="code"
      tag="textarea"
      :config="froalaConfig"
    />
    <VBtn
      v-if="withEditMode"
      class="mt-1 mb-2"
      @click="apply"
    >
      {{ $t('action.apply') }}
    </VBtn>
  </div>
</template>

<style scoped lang="scss">
$code-color-black: #000;
$code-color-red: #9c251d;
$code-color-blue: #1d1b93;
$code-color-green: #2f6447;

.code-view-editor {
  &:not(&--edit-mode) {
    pointer-events: none;
    textarea {
      display: none !important;
    }
  }

  :deep(.fr-box) {
    .fr-second-toolbar {
      display: none !important;
    }
  }

  .fr-wrapper {
    .CodeMirror {
      color: $code-color-black;
    }
    .CodeMirror-gutters {
      background-color: initial;
      white-space: nowrap;
    }

    .cm-atom {
      color: $code-color-blue;
    }
    .cm-string.cm-property {
      color: $code-color-red;
      line-height: 20px;
    }
    .cm-number {
      color: $code-color-green;
    }
    .CodeMirror-gutters {
      border-style: none;
    }
  }
  .fr-box.fr-basic.fr-top .fr-wrapper {
    border-style: none;
  }
  .CodeMirror-gutters {
    padding-right: 0.875rem;
  }
}
</style>
