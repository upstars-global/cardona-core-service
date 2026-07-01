import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PasswordField from '../../components/templates/FieldGenerator/_components/PasswordField.vue'
import { PasswordBaseField } from '../../@model/templates/baseField'

/**
 * Password input with show/hide toggle.
 * Optional password generator button (wrench icon) appears when `field.withPasswordGenerator` is true.
 */
const meta = {
  title: 'FieldGenerator/PasswordField',
  component: PasswordField,
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
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (hidden)',
  args: {
    modelValue: '',
    field: new PasswordBaseField({ key: 'password', label: 'Password', placeholder: 'Enter password' }),
  },
}

export const WithValue: Story = {
  name: 'With value (hidden)',
  args: {
    modelValue: 'SecretPass123!',
    field: new PasswordBaseField({ key: 'password', label: 'Password' }),
  },
}

export const ShowPassword: Story = {
  name: 'Show password by default',
  args: {
    modelValue: 'Visible123!',
    field: new PasswordBaseField({ key: 'password', label: 'Password', showPassword: true }),
  },
}

export const WithGenerator: Story = {
  name: 'With password generator button',
  args: {
    modelValue: '',
    field: new PasswordBaseField({
      key: 'password',
      label: 'Password',
      withPasswordGenerator: true,
      placeholder: 'Enter or generate password',
    }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new PasswordBaseField({ key: 'password', label: 'Password' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: 'hidden-value',
    disabled: true,
    field: new PasswordBaseField({ key: 'password', label: 'Password' }),
  },
}
