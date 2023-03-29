<template>
  <div class="code-view-editor">
    <froala tag="textarea" :config="froalaConfig" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'vue-froala-wysiwyg'
import FroalaEditor from 'froala-editor'

export default defineComponent({
  name: 'CodeViewEditor',

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const froalaConfig = {
      apiKey: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
      key: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
      pluginsEnabled: ['codeView', 'codeMirror'],
      toolbarButtons: {},
      enter: FroalaEditor.ENTER_BR,
      codeMirrorOptions: {
        indentWithTabs: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'application/json',
        tabMode: 'indent',
        tabSize: 2,
      },
      events: {
        initialized() {
          const editor: any = this

          editor.html.set(JSON.stringify(props.value, null, '\t'))
          editor.codeView.toggle()
          editor.edit.off()
        },
      },
    }

    return {
      froalaConfig,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../@core/scss/base/bootstrap-extended/_variables.scss';

.code-view-editor::v-deep {
  pointer-events: none;

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
  .fr-second-toolbar,
  textarea {
    display: none !important;
  }
}
</style>
