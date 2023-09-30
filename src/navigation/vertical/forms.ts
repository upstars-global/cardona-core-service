export default [
  { heading: 'Forms & Tables' },
  {
    title: 'Form Elements',
    icon: { icon: 'tabler-toggle-left' },
    children: [
      { title: 'Autocomplete', to: 'forms-autocomplete' },
      { title: 'Checkbox', to: 'forms-checkbox' },
      { title: 'Combobox', to: 'forms-combobox' },
      { title: 'Date Time Picker', to: 'forms-date-time-picker' },
      { title: 'File Input', to: 'forms-file-input' },
      { title: 'Radio', to: 'forms-radio' },
      { title: 'Custom Input', to: 'forms-custom-input' },
      { title: 'Range Slider', to: 'forms-range-slider' },
      { title: 'Rating', to: 'forms-rating' },
      { title: 'Select', to: 'forms-select' },
      { title: 'Slider', to: 'forms-slider' },
      { title: 'Switch', to: 'forms-switch' },
      { title: 'Textarea', to: 'forms-textarea' },
      { title: 'Textfield', to: 'forms-textfield' },
    ],
  },
  {
    title: 'Form Layouts',
    icon: { icon: 'tabler-layout-navbar' },
    to: 'forms-form-layouts',
  },
  {
    title: 'Form Validation',
    icon: { icon: 'tabler-checkbox' },
    to: 'forms-form-validation',
  },
  {
    title: 'Tables',
    icon: { icon: 'tabler-table' },
    children: [
      { title: 'Simple Table', to: 'tables-simple-table' },
      { title: 'Data Table', to: 'tables-data-table' },
    ],
  },
]
