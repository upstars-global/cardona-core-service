import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DummySelectField from '../../components/templates/FieldGenerator/_components/DummySelectField.vue'

/**
 * A lightweight vue-select wrapper that uses raw props instead of a field class.
 * Used when a simple external-data-driven select is needed without FieldGenerator integration.
 * Unlike SelectField, options and placeholder are passed directly as props.
 */
const meta = {
  title: 'FieldGenerator/DummySelectField',
  component: DummySelectField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: false },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    placeholder: { control: 'text' },
    size: { control: 'text' },
    options: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
    size: '',
    placeholder: 'Choose...',
  },
} satisfies Meta<typeof DummySelectField>

export default meta
type Story = StoryObj<typeof meta>

const CURRENCY_OPTIONS = [
  { id: 'USD', name: 'USD — US Dollar' },
  { id: 'EUR', name: 'EUR — Euro' },
  { id: 'UAH', name: 'UAH — Ukrainian Hryvnia' },
  { id: 'GBP', name: 'GBP — British Pound' },
]

export const Default: Story = {
  name: 'Default (no selection)',
  args: {
    modelValue: undefined,
    options: CURRENCY_OPTIONS,
    placeholder: 'Select currency',
  },
}

export const WithValue: Story = {
  name: 'With selected value',
  args: {
    modelValue: { id: 'USD', name: 'USD — US Dollar' },
    options: CURRENCY_OPTIONS,
    placeholder: 'Select currency',
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: undefined,
    options: CURRENCY_OPTIONS,
    errors: true,
    placeholder: 'Select currency',
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: { id: 'EUR', name: 'EUR — Euro' },
    options: CURRENCY_OPTIONS,
    disabled: true,
    placeholder: 'Select currency',
  },
}
