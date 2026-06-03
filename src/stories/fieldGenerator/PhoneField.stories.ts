import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PhoneField from '../../components/templates/FieldGenerator/_components/PhoneField.vue'
import { PhoneBaseField } from '../../@model/templates/baseField'

/**
 * Phone number input with country flag detection and Cleave.js masking.
 * The flag is derived from the phone's country code prefix.
 * Format: +XX XXX XXX XX XXXX
 */
const meta = {
  title: 'FieldGenerator/PhoneField',
  component: PhoneField,
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
} satisfies Meta<typeof PhoneField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Empty',
  args: {
    modelValue: '',
    field: new PhoneBaseField({ key: 'phone', label: 'Phone' }),
  },
}

export const USNumber: Story = {
  name: 'US number (flag shown)',
  args: {
    modelValue: '+14155552671',
    field: new PhoneBaseField({ key: 'phone', label: 'Phone' }),
  },
}

export const UANumber: Story = {
  name: 'UA number (flag shown)',
  args: {
    modelValue: '+380671234567',
    field: new PhoneBaseField({ key: 'phone', label: 'Phone' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new PhoneBaseField({ key: 'phone', label: 'Phone' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: '+14155552671',
    disabled: true,
    field: new PhoneBaseField({ key: 'phone', label: 'Phone' }),
  },
}
