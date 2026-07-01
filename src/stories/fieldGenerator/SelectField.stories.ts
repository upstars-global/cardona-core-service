import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue'
import { SelectBaseField } from '../../@model/templates/baseField'

/**
 * Single-value vue-select dropdown.
 * When `field.options` is provided, no async fetch is triggered.
 * Supports clearable, append-to-body, and infinite scroll modes.
 */
const meta = {
  title: 'FieldGenerator/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: false },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    field: { control: false },
    size: { control: false },
    placeholder: { control: 'text' },
  },
  args: {
    disabled: false,
    errors: false,
    size: '',
  },
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

const STATUS_OPTIONS = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'pending', name: 'Pending' },
  { id: 'blocked', name: 'Blocked' },
]

export const Default: Story = {
  name: 'Default (no selection)',
  args: {
    modelValue: '',
    field: new SelectBaseField({ key: 'status', label: 'Status', options: STATUS_OPTIONS }),
  },
}

export const WithValue: Story = {
  name: 'With selected value',
  args: {
    modelValue: { id: 'active', name: 'Active' },
    field: new SelectBaseField({ key: 'status', label: 'Status', options: STATUS_OPTIONS }),
  },
}

export const NotClearable: Story = {
  name: 'Not clearable',
  args: {
    modelValue: { id: 'active', name: 'Active' },
    field: new SelectBaseField({
      key: 'status',
      label: 'Status',
      options: STATUS_OPTIONS,
      clearable: false,
    }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new SelectBaseField({ key: 'status', label: 'Status', options: STATUS_OPTIONS }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: { id: 'active', name: 'Active' },
    disabled: true,
    field: new SelectBaseField({ key: 'status', label: 'Status', options: STATUS_OPTIONS }),
  },
}
