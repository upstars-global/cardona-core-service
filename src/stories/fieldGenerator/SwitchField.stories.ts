import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SwitchField from '../../components/templates/FieldGenerator/_components/SwitchField.vue'
import { SwitchBaseField } from '../../@model/templates/baseField'
import { VSizes } from '../../@model/vuetify'

/**
 * Toggle switch with optional state icon.
 * When `field.withState` is true, shows a check/X icon in green/red next to the label.
 */
const meta = {
  title: 'FieldGenerator/SwitchField',
  component: SwitchField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: Object.values(VSizes) },
    field: { control: false },
  },
  args: {
    disabled: false,
    size: VSizes.Medium,
  },
} satisfies Meta<typeof SwitchField>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {
  name: 'Off',
  args: {
    modelValue: false,
    field: new SwitchBaseField({ key: 'isActive', label: 'Active' }),
  },
}

export const On: Story = {
  name: 'On',
  args: {
    modelValue: true,
    field: new SwitchBaseField({ key: 'isActive', label: 'Active' }),
  },
}

export const WithStateOff: Story = {
  name: 'With state icon (off)',
  args: {
    modelValue: false,
    field: new SwitchBaseField({ key: 'isActive', label: 'Is active', withState: true }),
  },
}

export const WithStateOn: Story = {
  name: 'With state icon (on)',
  args: {
    modelValue: true,
    field: new SwitchBaseField({ key: 'isActive', label: 'Is active', withState: true }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: true,
    disabled: true,
    field: new SwitchBaseField({ key: 'isActive', label: 'Active' }),
  },
}
