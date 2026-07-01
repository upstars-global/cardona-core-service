import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue'
import { NumberBaseField } from '../../@model/templates/baseField'

/**
 * Numeric text input. Wraps AppTextField with type="number".
 * Supports positive-only and integer-only constraints via field config.
 * Prevents 'e', ',' and '-' key presses based on field flags.
 */
const meta = {
  title: 'FieldGenerator/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    field: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
  },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (empty)',
  args: {
    modelValue: '',
    field: new NumberBaseField({ key: 'amount', label: 'Amount', placeholder: 'Enter amount' }),
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    modelValue: 1500,
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}

export const PositiveOnly: Story = {
  name: 'Positive numbers only',
  args: {
    modelValue: '',
    field: new NumberBaseField({ key: 'score', label: 'Score', withPositiveNumbers: true }),
  },
}

export const IntegerOnly: Story = {
  name: 'Integer numbers only',
  args: {
    modelValue: '',
    field: new NumberBaseField({ key: 'count', label: 'Count', isIntegerNumbers: true }),
  },
}

export const WithSuffix: Story = {
  name: 'With suffix',
  args: {
    modelValue: 75,
    field: new NumberBaseField({ key: 'percent', label: 'Percent', append: '%' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: 9999,
    disabled: true,
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}
