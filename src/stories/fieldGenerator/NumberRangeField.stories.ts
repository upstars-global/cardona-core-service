import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NumberRangeField from '../../components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { NumberBaseField } from '../../@model/templates/baseField'

/**
 * Two side-by-side number inputs representing a from–to range.
 * Delegates to NumberField for each bound.
 * The `field` prop is a NumberBaseField — it is shared between both inputs.
 */
const meta = {
  title: 'FieldGenerator/NumberRangeField',
  component: NumberRangeField,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    field: { control: false },
    modelValue: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
  },
} satisfies Meta<typeof NumberRangeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (empty)',
  args: {
    modelValue: { from: '', to: '' },
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    modelValue: { from: 100, to: 5000 },
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}

export const WithPlaceholder: Story = {
  name: 'With custom placeholder',
  args: {
    modelValue: { from: '', to: '' },
    field: new NumberBaseField({ key: 'bet', label: 'Bet', placeholder: 'Bet' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: { from: '', to: '' },
    errors: true,
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: { from: 50, to: 200 },
    disabled: true,
    field: new NumberBaseField({ key: 'amount', label: 'Amount' }),
  },
}
