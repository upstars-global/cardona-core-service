import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TimeField from '../../components/templates/FieldGenerator/_components/TimeField.vue'
import { TimeBaseField } from '../../@model/templates/baseField'

/**
 * Time picker using flatpickr in time-only mode (no calendar).
 * Supports HH:MM and HH:MM:SS formats via the `format` prop.
 * Clock icon opens the picker on click.
 */
const meta = {
  title: 'FieldGenerator/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    format: { control: 'select', options: ['H:i', 'H:i:s'] },
    field: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
    format: 'H:i',
  },
} satisfies Meta<typeof TimeField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Empty',
  args: {
    modelValue: '',
    field: new TimeBaseField({ key: 'startTime', label: 'Start time', placeholder: 'HH:MM' }),
  },
}

export const WithValue: Story = {
  name: 'With value',
  args: {
    modelValue: '14:30',
    field: new TimeBaseField({ key: 'startTime', label: 'Start time' }),
  },
}

export const WithSeconds: Story = {
  name: 'With seconds (H:i:s format)',
  args: {
    modelValue: '14:30:00',
    format: 'H:i:s',
    field: new TimeBaseField({ key: 'startTime', label: 'Start time' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: '',
    errors: true,
    field: new TimeBaseField({ key: 'startTime', label: 'Start time' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: '09:00',
    disabled: true,
    field: new TimeBaseField({ key: 'startTime', label: 'Start time' }),
  },
}
