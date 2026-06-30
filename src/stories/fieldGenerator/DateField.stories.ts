import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DateField from '../../components/templates/FieldGenerator/_components/DateField.vue'
import { DateBaseField } from '../../@model/templates/baseField'

/**
 * Date picker using flatpickr. Supports:
 * - Single date (default)
 * - Date + time (`field.withTime`)
 * - Date range mode (`field.isRangeMode`) — two pickers side-by-side
 *
 * Values are ISO 8601 strings. In range mode the value is two ISOs
 * joined with a localised separator (e.g. " - ").
 */
const meta = {
  title: 'FieldGenerator/DateField',
  component: DateField,
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
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const SingleEmpty: Story = {
  name: 'Single date (empty)',
  args: {
    modelValue: '',
    field: new DateBaseField({ key: 'startedAt', label: 'Start date' }),
  },
}

export const SingleWithValue: Story = {
  name: 'Single date (with value)',
  args: {
    modelValue: '2025-06-01T00:00:00.000Z',
    field: new DateBaseField({ key: 'startedAt', label: 'Start date' }),
  },
}

export const WithTime: Story = {
  name: 'Date + time',
  args: {
    modelValue: '2025-06-15T14:30:00.000Z',
    field: new DateBaseField({ key: 'scheduledAt', label: 'Scheduled at', withTime: true }),
  },
}

export const RangeModeEmpty: Story = {
  name: 'Range mode (empty)',
  args: {
    modelValue: '',
    field: new DateBaseField({ key: 'period', label: 'Period', isRangeMode: true }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new DateBaseField({ key: 'startedAt', label: 'Start date' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: '2025-06-01T00:00:00.000Z',
    disabled: true,
    field: new DateBaseField({ key: 'startedAt', label: 'Start date' }),
  },
}
