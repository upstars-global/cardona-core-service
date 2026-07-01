import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CheckField from '../../components/templates/FieldGenerator/_components/CheckField.vue'
import { CheckBaseField } from '../../@model/templates/baseField'

/**
 * Single checkbox. The label comes from `field.label`.
 * Used in FieldGenerator for boolean form fields.
 */
const meta = {
  title: 'FieldGenerator/CheckField',
  component: CheckField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    field: { control: false },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof CheckField>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  name: 'Unchecked',
  args: {
    modelValue: false,
    field: new CheckBaseField({ key: 'isActive', label: 'Is active' }),
  },
}

export const Checked: Story = {
  name: 'Checked',
  args: {
    modelValue: true,
    field: new CheckBaseField({ key: 'isActive', label: 'Is active', value: true }),
  },
}

export const Disabled: Story = {
  name: 'Disabled (checked)',
  args: {
    modelValue: true,
    disabled: true,
    field: new CheckBaseField({ key: 'isActive', label: 'Is active' }),
  },
}

export const DisabledUnchecked: Story = {
  name: 'Disabled (unchecked)',
  args: {
    modelValue: false,
    disabled: true,
    field: new CheckBaseField({ key: 'isActive', label: 'Is active' }),
  },
}
