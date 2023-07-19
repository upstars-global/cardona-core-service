<template>
  <div class="code-view-editor" :class="{ 'code-view-editor--edit-mode': withEditMode }">
    <froala v-model="code" tag="textarea" :config="froalaConfig" />
    <b-btn v-if="withEditMode" class="mt-1 mb-2" @click="apply">{{ $t('action.apply') }}</b-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'vue-froala-wysiwyg'
import FroalaEditor from 'froala-editor'

export default defineComponent({
  name: 'CodeViewEditor',

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    withEditMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const editor = ref({})
    const froalaConfig = {
      apiKey: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
      key: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
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

          editor.value.html.set(JSON.stringify(props.value, null, '\t'))
          editor.value.codeView.toggle()
        },
      },
    }

    const code = ref(JSON.stringify(props.value, null, '\t'))
    const apply = () => {
      editor.value.codeView.toggle()
      editor.value.codeView.toggle()
      emit('input', JSON.parse(code.value))
    }

    return {
      froalaConfig,
      code,
      apply,
    }
  },
})
</script>

<style lang="scss">
@import '../@core/scss/base/bootstrap-extended/_variables.scss';

.code-view-editor {
  &:not(&--edit-mode) {
    pointer-events: none;
    textarea {
      display: none !important;
    }
  }

  .fr-wrapper {
    background-color: $input-disabled-bg;
    border-radius: 0.5rem;
    border: 1px solid $custom-control-border-color !important;

    .fr-view {
      color: $body-color;
    }

    .CodeMirror {
      background-color: $input-disabled-bg;
      border-radius: 0.5rem;
    }
  }

  .fr-toolbar,
  .fr-second-toolbar {
    display: none !important;
  }
}
</style>
