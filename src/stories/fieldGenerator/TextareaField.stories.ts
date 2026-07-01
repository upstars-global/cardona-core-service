import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TextareaField from '../../components/templates/FieldGenerator/_components/TextareaField.vue'
import { TextareaBaseField } from '../../@model/templates/baseField'

/**
 * Multi-line textarea. Wraps AppTextarea.
 * Supports character counter via `field.maxLength` and auto-height growth.
 */
const meta = {
  title: 'FieldGenerator/TextareaField',
  component: TextareaField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    field: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
  },
} satisfies Meta<typeof TextareaField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (empty)',
  args: {
    modelValue: '',
    field: new TextareaBaseField({ key: 'description', label: 'Description' }),
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    modelValue: 'High-priority campaign for the summer season. Targets VIP slots players.',
    field: new TextareaBaseField({ key: 'description', label: 'Description' }),
  },
}

export const WithMaxLength: Story = {
  name: 'With character counter (max 200)',
  args: {
    modelValue: 'Short description here.',
    field: new TextareaBaseField({ key: 'description', label: 'Description', maxLength: 200 }),
  },
}

export const AutoHeight: Story = {
  name: 'Auto-height (grows with content)',
  args: {
    modelValue: 'Line one\nLine two\nLine three\nLine four',
    field: new TextareaBaseField({ key: 'notes', label: 'Notes', autoHeight: true }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new TextareaBaseField({ key: 'description', label: 'Description' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: 'Read-only content.',
    disabled: true,
    field: new TextareaBaseField({ key: 'description', label: 'Description' }),
  },
}
