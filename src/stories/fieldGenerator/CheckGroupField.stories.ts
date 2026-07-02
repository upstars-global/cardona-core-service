import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CheckGroupField from '../../components/templates/FieldGenerator/_components/CheckGroupField.vue'
import { CheckGroupBaseField } from '../../@model/templates/baseField'

/**
 * A group of checkboxes rendered from `field.options`.
 * Binds each option by `option.id` and stores selected ids in modelValue.
 */
const meta = {
  title: 'FieldGenerator/CheckGroupField',
  component: CheckGroupField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: false },
    disabled: { control: 'boolean' },
    field: { control: false },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof CheckGroupField>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = [
  { id: 'slots', name: 'Slots' },
  { id: 'poker', name: 'Poker' },
  { id: 'roulette', name: 'Roulette' },
  { id: 'blackjack', name: 'Blackjack' },
]

export const NoneSelected: Story = {
  name: 'None selected',
  args: {
    modelValue: [],
    field: new CheckGroupBaseField({ key: 'gameTypes', label: 'Game types', options: OPTIONS }),
  },
}

export const SomeSelected: Story = {
  name: 'Some selected',
  args: {
    modelValue: ['slots', 'blackjack'],
    field: new CheckGroupBaseField({ key: 'gameTypes', label: 'Game types', options: OPTIONS }),
  },
}

export const AllSelected: Story = {
  name: 'All selected',
  args: {
    modelValue: ['slots', 'poker', 'roulette', 'blackjack'],
    field: new CheckGroupBaseField({ key: 'gameTypes', label: 'Game types', options: OPTIONS }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: ['slots', 'poker'],
    disabled: true,
    field: new CheckGroupBaseField({ key: 'gameTypes', label: 'Game types', options: OPTIONS }),
  },
}
