<template>
  <div class="block-text-edite">
    <variable-modal
      v-if="variableKeySelect"
      :key="variableKeySelect"
      :value="variableTextBuffer[variableKeySelect]"
      :key-var="variableKeySelect"
      @update-value="updateVariableTextByKey"
      @close-modal="variableKeyUnselect"
      @delete-key="deleteVariableTextByKey"
    />
    <div class="editor-wrap" :class="{ disabled }">
      <froala v-model.trim="content" if="froala-editor" :tag="'textarea'" :config="config"></froala>
    </div>

    <div
      v-if="Object.keys(variableTextBuffer).length"
      class="d-flex flex-wrap align-items-center block-text-edite-variable pt-1"
    >
      <span class="font-small-3 font-weight-bolder mr-1 mb-50">
        {{ $t('common.editor.addedVariables') }}
      </span>
      <b-badge
        v-for="key in Object.keys(variableTextBuffer)"
        :key="key"
        v-b-modal.variable-modal
        variant="light-primary"
        class="tag-variable mr-1 mb-50"
        @click="setVariableKeySelect(key)"
      >
        {{ `{${key}\}` }}
      </b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { VBTooltip } from 'bootstrap-vue'
import VariableModal from '@/components/TextEditorWysiwyg/VariableModal'
import 'vue-froala-wysiwyg'
import FroalaEditor from 'froala-editor'
import i18n from '@/libs/i18n'

export default {
  name: 'TextEditorWysiwyg',
  components: { VariableModal },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    optionsVariable: {
      type: Array,
      default: () => [],
    },
    localisationParameters: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: () => i18n.t('common.description'),
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'update-localisation-parameters'],

  setup(props, { emit }) {
    const content = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const globalEditor = ref()
    let flagOneNoEmpty = true
    const variableTextBuffer = computed({
      get: () => {
        if (Object.keys(props.localisationParameters).isNotEmpty && flagOneNoEmpty) {
          flagOneNoEmpty = false
          Object.keys(props.localisationParameters)?.forEach((itemKey: string) => {
            props.optionsVariable?.forEach((currency: string) => {
              props!.localisationParameters[itemKey][currency] = props.localisationParameters?.[
                itemKey
              ]?.[currency]
                ? props.localisationParameters[itemKey][currency]
                : ''
            })
          })
        }
        return props.localisationParameters
      },
      set: (val) => {
        emit('update-localisation-parameters', val)
      },
    })

    // Буффер для хранения всех переменных для текушего экземпляра редактора.
    // Нужен для востановления данных удаленных переменных которые вернули в текст
    const variableText = ref(Object.assign(variableTextBuffer.value))
    const variableKeySelect = ref('')
    const defaultObjLocalisationParameters = {}
    props.optionsVariable.forEach((item) => {
      defaultObjLocalisationParameters[item] = ''
    })

    const config = {
      placeholderText: props.placeholder,
      apiKey: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
      key: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
      enter: FroalaEditor.ENTER_BR,
      pluginsEnabled: [
        'align',
        'charCounter',
        'codeBeautifier',
        'codeView',
        'codeMirror',
        'colors',
        'draggable',
        'embedly',
        'emoticons',
        'fontFamily',
        'fontSize',
        'fullscreen',
        'inlineStyle',
        'inlineClass',
        'lineBreaker',
        'lineHeight',
        'link',
        'lists',
        'paragraphFormat',
        'paragraphStyle',
        'quickInsert',
        'quote',
        'save',
        'table',
        'url',
        'wordPaste',
      ],
      shortcutsEnabled: ['bold', 'italic'],
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontFamily',
            'fontSize',
            'textColor',
            'backgroundColor',
            'inlineClass',
            'inlineStyle',
            'clearFormatting',
          ],
        },

        moreParagraph: {
          buttons: [
            'alignLeft',
            'alignCenter',
            'formatOLSimple',
            'alignRight',
            'alignJustify',
            'formatOL',
            'formatUL',
            'paragraphFormat',
            'paragraphStyle',
            'lineHeight',
            'outdent',
            'indent',
            'quote',
          ],
        },

        moreRich: {
          buttons: [
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'fontAwesome',
            'specialCharacters',
            'embedly',
            'insertFile',
            'insertHR',
          ],
          buttonsVisible: 5,
        },
        moreMisc: {
          buttons: [
            'undo',
            'redo',
            'fullscreen',
            'print',
            'spellChecker',
            'selectAll',
            'html',
            'help',
          ],
          align: 'right',
          buttonsVisible: 6,
        },
      },
      codeBeautifierOptions: {
        end_with_newline: true,
        indent_inner_html: true,
        extra_liners:
          "['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'table', 'dl', 'pre', 'img']",
        brace_style: 'expand',
        indent_char: ' ',
        indent_size: 4,
        wrap_line_length: 0,
      },
      codeMirrorOptions: {
        indentWithTabs: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/html',
        tabMode: 'indent',
        tabSize: 2,
      },
      events: {
        initialized: function () {
          globalEditor.value = this

          if (props.disabled) globalEditor.value.edit.off()
        },
        contentChanged: function () {
          if (!globalEditor.value) {
            globalEditor.value = this
          }
          let editor: any = this
          const contentChanged = editor.html.get()

          // Проверить последний символ content.value и сделать описание причины
          // {{ }} - договор по указанию переменных
          const startIndex = contentChanged.indexOf('{{')
          const endIndex = contentChanged.indexOf('}}')

          if (startIndex > -1 && endIndex > -1) {
            const keyVar = contentChanged.slice(startIndex + 2, endIndex).trim()
            // что бы была возможность указать {{ }} пустые скобки и не получить пустой переменной
            if (!keyVar) return

            if (variableTextBuffer.value[keyVar]) {
              // Если данные есть в буффере то забираем их оттуда
              // Используеться при возвращении переменной после удаления
              variableText.value[keyVar] = variableTextBuffer.value[keyVar]
            } else {
              variableText.value[keyVar] = { ...defaultObjLocalisationParameters }
              variableTextBuffer.value[keyVar] = { ...defaultObjLocalisationParameters }
            }

            editor.selection.save() //Сохраняем положение каретки
            editor.html.set(
              editor.html
                .get(true) // Параметр true нужен для возвращения HTML вместе с положением каретки текста
                .replace(' {{', '{{')
                .replace('}} ', '}}')
                .replace('{{', '&nbsp;<span class="variable-box">{')
                .replace('}}', '}</span>&nbsp;')
            )
            editor.selection.restore()
          } else {
            updateVariableInContent(editor)
          }

          // TODO: Delete id="isPasted" in copy text html
          editor.selection.save()
          editor.html.set(editor.html.get(true).replace(/id="isPasted"/g, ''))
          editor.selection.restore()

          emit('input', contentChanged)
        },
      },
    }

    const newVariableText = ref({})
    // Данный метод нужен для обнавления переменных из текста который пришел с АПИ
    // Так же обновления рания удаленых переменных после их возвращения в текст при помощи одиночной скобки '}'
    const updateVariableInContent = (editor) => {
      const contentChanged = editor.html.get(true)
      newVariableText.value = {}
      Object.keys(variableTextBuffer.value).forEach((key) => {
        const variable = '<span class="variable-box">{' + key + '}</span>'
        if (contentChanged.includes(variable)) {
          newVariableText.value[key] = variableTextBuffer.value[key]
          if (!variableText.value[key]) {
            editor.selection.restore()
            editor.selection.setAfter(editor.selection.element())
            editor.selection.restore()
            editor.html.insert('&nbsp;')
          }
        }
      })
      variableText.value = newVariableText.value
    }

    const variableKeyUnselect = () => {
      variableKeySelect.value = ''
    }
    const setVariableKeySelect = (key) => {
      // Установить ключь для работы с конкретной переменной
      // Данный ключь будет использоваться в модальном окне
      variableKeySelect.value = key
    }
    const updateVariableTextByKey = (val) => {
      // Обнавления значения данных для переменной по ключу
      // Так же обновляем буффер
      if (!variableKeySelect.value) return
      variableText.value[variableKeySelect.value] = val
      variableTextBuffer.value[variableKeySelect.value] = val
      variableKeySelect.value = ''
    }
    const deleteVariableTextByKey = () => {
      // Удаляем только с масива переменных но оставляем в буффере для возвращения заполненных данных
      if (!globalEditor.value) return
      globalEditor.value.html.set(
        globalEditor.value.html
          .get(true) // Параметр true нужен для возвращения HTML вместе с положением каретки текста
          .replaceAll('<span class="variable-box">{' + variableKeySelect.value + '}</span>', '')
          .replaceAll('&nbsp;&nbsp;', '')
      )
      delete variableText.value[variableKeySelect.value]
      delete variableTextBuffer.value[variableKeySelect.value]
      variableKeySelect.value = ''
    }

    return {
      content,
      config,
      variableTextBuffer,
      variableKeyUnselect,
      setVariableKeySelect,
      variableKeySelect,
      updateVariableTextByKey,
      deleteVariableTextByKey,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/base/bootstrap-extended/_include';
@import '~@core/scss/base/components/include';

.dark-layout {
  .block-text-edite {
    .fr-toolbar,
    .fr-element,
    .fr-second-toolbar {
      background: $theme-dark-input-bg;
      color: $theme-dark-body-color;
    }
    .fr-toolbar,
    .fr-popup,
    .fr-modal {
      .fr-command.fr-btn {
        color: $theme-dark-body-color;
        svg path {
          fill: $theme-dark-body-color;
        }
      }
    }
    .fr-desktop .fr-command:hover:not(.fr-table-cell),
    .fr-desktop .fr-command:focus:not(.fr-table-cell),
    .fr-desktop .fr-command.fr-btn-hover:not(.fr-table-cell),
    .fr-desktop .fr-command.fr-expanded:not(.fr-table-cell) {
      background: $theme-dark-table-header-bg;
    }
  }
}

.block-text-edite {
  .fr-qi-helper a.fr-btn.fr-floating-btn {
    padding: 10px 10px 10px 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .fr-element {
    color: $body-color;
  }
  .variable-box {
    display: inline-block;
    background: rgba(108, 117, 125, 0.12);
    color: $body-color;
    padding: 1px 0.285rem;
  }
  .block-text-edite-variable {
    .tag-variable {
      cursor: pointer;

      &:hover {
        background: rgba(115, 103, 240, 0.08);
        color: $purple;
      }
    }
  }
}

.bordered-layout {
  .editor-wrap {
    &.disabled {
      .fr-toolbar,
      .fr-wrapper,
      .fr-second-toolbar {
        background-color: $input-disabled-bg;

        .fr-view {
          color: $body-color;
        }
      }
    }
  }
}
</style>
