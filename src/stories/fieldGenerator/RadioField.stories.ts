import type { Meta, StoryObj } from '@storybook/vue3-vite'
import RadioField from '../../components/templates/FieldGenerator/_components/RadioField.vue'
import { RadioBaseField } from '../../@model/templates/baseField'

/**
 * Inline radio group. Options are defined on the field via `field.options[]`.
 * Each option has `{ text, value }` where value can be string or boolean.
 */
const meta = {
  title: 'FieldGenerator/RadioField',
  component: RadioField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: false },
    field: { control: false },
  },
} satisfies Meta<typeof RadioField>

export default meta
type Story = StoryObj<typeof meta>

export const StringOptions: Story = {
  name: 'String options (none selected)',
  args: {
    modelValue: '',
    field: new RadioBaseField({
      key: 'period',
      label: 'Period',
      options: [
        { text: 'Daily', value: 'daily' },
        { text: 'Weekly', value: 'weekly' },
        { text: 'Monthly', value: 'monthly' },
      ],
    }),
  },
}

export const StringOptionsSelected: Story = {
  name: 'String options (selected)',
  args: {
    modelValue: 'weekly',
    field: new RadioBaseField({
      key: 'period',
      label: 'Period',
      options: [
        { text: 'Daily', value: 'daily' },
        { text: 'Weekly', value: 'weekly' },
        { text: 'Monthly', value: 'monthly' },
      ],
    }),
  },
}

export const BooleanOptions: Story = {
  name: 'Boolean options',
  args: {
    modelValue: true,
    field: new RadioBaseField({
      key: 'isActive',
      label: 'Status',
      options: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
    }),
  },
}
