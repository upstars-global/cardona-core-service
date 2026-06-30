import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CurrencyField from '../../components/templates/FieldGenerator/_components/CurrencyField.vue'
import { CurrencyBaseField } from '../../@model/templates/baseField'

/**
 * Currency value input. Delegates to:
 * - NumberField when `field.withString` is false (default) — value treated as cents
 * - TextField when `field.withString` is true — value kept as-is string
 *
 * When `isCents` is true (default), the stored value is ×100 of what is displayed.
 */
const meta = {
  title: 'FieldGenerator/CurrencyField',
  component: CurrencyField,
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
} satisfies Meta<typeof CurrencyField>

export default meta
type Story = StoryObj<typeof meta>

export const AsNumber: Story = {
  name: 'As number (cents → display value)',
  args: {
    modelValue: 150000,
    field: new CurrencyBaseField({
      key: 'amount',
      label: 'Amount',
      value: 150000,
      isCents: true,
    }),
  },
}

export const AsNumberEmpty: Story = {
  name: 'As number (empty)',
  args: {
    modelValue: 0,
    field: new CurrencyBaseField({ key: 'amount', label: 'Amount', value: 0 }),
  },
}

export const AsString: Story = {
  name: 'As string (withString mode)',
  args: {
    modelValue: '1500.50',
    field: new CurrencyBaseField({
      key: 'amount',
      label: 'Amount',
      value: 1500.50,
      withString: true,
      isCents: false,
    }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: 0,
    errors: true,
    field: new CurrencyBaseField({ key: 'amount', label: 'Amount', value: 0 }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: 99900,
    disabled: true,
    field: new CurrencyBaseField({ key: 'amount', label: 'Amount', value: 99900, isCents: true }),
  },
}
