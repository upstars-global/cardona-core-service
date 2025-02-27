import FroalaEditor from 'froala-editor'

const baseConfig = {
  apiKey: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
  key: 'uXD2lC7D6G4D3H4H4C11dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8E6D2B4C4G2F3C2==',
  enter: FroalaEditor.ENTER_BR,
  imageUpload: true,
  pluginsEnabled: [
    'image',
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
        'gallery',
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
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'right',
      buttonsVisible: 6,
    },
  },
  codeBeautifierOptions: {
    end_with_newline: true,
    indent_inner_html: true,
    extra_liners:
      '[\'p\', \'h1\', \'h2\', \'h3\', \'h4\', \'h5\', \'h6\', \'blockquote\', \'pre\', \'ul\', \'ol\', \'table\', \'dl\', \'pre\', \'img\']',
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
  toolbarSticky: false,
}

export default baseConfig
