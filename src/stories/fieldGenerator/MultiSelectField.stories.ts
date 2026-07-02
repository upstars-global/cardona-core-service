import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MultiSelectField from '../../components/templates/FieldGenerator/_components/MultiSelectField.vue'
import { MultiSelectBaseField } from '../../@model/templates/baseField'

/**
 * Multi-value vue-select dropdown. Selected options appear as chips.
 * When `field.options` is provided, no async fetch is triggered.
 * Supports copy-to-clipboard on chip id via `field.withCopyId`.
 */
const meta = {
  title: 'FieldGenerator/MultiSelectField',
  component: MultiSelectField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: false },
    disabled: { control: 'boolean' },
    errors: { control: 'boolean' },
    field: { control: false },
  },
  args: {
    disabled: false,
    errors: false,
  },
} satisfies Meta<typeof MultiSelectField>

export default meta
type Story = StoryObj<typeof meta>

const GAME_OPTIONS = [
  { id: 'slots', name: 'Slots' },
  { id: 'poker', name: 'Poker' },
  { id: 'roulette', name: 'Roulette' },
  { id: 'blackjack', name: 'Blackjack' },
  { id: 'baccarat', name: 'Baccarat' },
]

export const Default: Story = {
  name: 'Default (no selection)',
  args: {
    modelValue: [],
    field: new MultiSelectBaseField({ key: 'games', label: 'Games', options: GAME_OPTIONS }),
  },
}

export const WithValue: Story = {
  name: 'With selected values',
  args: {
    modelValue: [
      { id: 'slots', name: 'Slots' },
      { id: 'poker', name: 'Poker' },
    ],
    field: new MultiSelectBaseField({ key: 'games', label: 'Games', options: GAME_OPTIONS }),
  },
}

export const WithCopyId: Story = {
  name: 'With copy ID button on chips',
  args: {
    modelValue: [{ id: 'slots', name: 'Slots' }],
    field: new MultiSelectBaseField({
      key: 'games',
      label: 'Games',
      options: GAME_OPTIONS,
      withCopyId: true,
    }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: [
      { id: 'slots', name: 'Slots' },
      { id: 'roulette', name: 'Roulette' },
    ],
    disabled: true,
    field: new MultiSelectBaseField({ key: 'games', label: 'Games', options: GAME_OPTIONS }),
  },
}
