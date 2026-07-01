import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TextField from '../../components/templates/FieldGenerator/_components/TextField.vue'
import { TextBaseField } from '../../@model/templates/baseField'

/**
 * Plain text input used by FieldGenerator for ListFieldType.Text.
 * Wraps AppTextField and forwards placeholder, prefix/suffix, and error state.
 */
const meta = {
  title: 'FieldGenerator/TextField',
  component: TextField,
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
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (empty)',
  args: {
    modelValue: '',
    field: new TextBaseField({ key: 'name', label: 'Name', placeholder: 'Enter name' }),
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    modelValue: 'Summer Tournament',
    field: new TextBaseField({ key: 'name', label: 'Name' }),
  },
}

export const WithSuffix: Story = {
  name: 'With suffix (%)',
  args: {
    modelValue: '75',
    field: new TextBaseField({ key: 'percent', label: 'Percent', append: '%' }),
  },
}

export const WithPrefix: Story = {
  name: 'With prefix ($)',
  args: {
    modelValue: '1500',
    field: new TextBaseField({ key: 'amount', label: 'Amount', prepend: '$' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new TextBaseField({ key: 'name', label: 'Name', placeholder: 'Enter name' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: 'Read-only value',
    disabled: true,
    field: new TextBaseField({ key: 'name', label: 'Name' }),
  },
}
