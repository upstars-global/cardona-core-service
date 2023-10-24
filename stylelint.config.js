module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-sass-guidelines',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    indentation: 2,
    'max-nesting-depth': [
      4,
      {
        ignore: ['pseudo-classes'],
      },
    ],
    'selector-max-compound-selectors': 5,
    'string-quotes': 'single',
    'number-leading-zero': 'always',
    'function-parentheses-space-inside': 'never-single-line',
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'scss/at-import-partial-extension-whitelist': ['scss', '.scss'],
  },
}
