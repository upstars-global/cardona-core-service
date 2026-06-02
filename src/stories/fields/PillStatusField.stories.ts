import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PillStatusField from '../../components/templates/BaseList/_components/fields/PillStatusField.vue'

/**
 * Used in BaseList (default.vue / compact.vue) via ListFieldType.PillStatus.
 * Receives a boolean `cell` value from the row mapped to :is-active.
 *
 * Renders a small colored dot (0.5rem) with a semi-transparent glow ring:
 *   isActive: true  → green  (--v-theme-success)
 *   isActive: false → yellow (--v-theme-warning)
 *
 * CSS also supports 'creation', 'updating', 'deleting' class states
 * but these are not reachable via the current prop API.
 */
const meta = {
  title: 'Fields/PillStatusField',
  component: PillStatusField,
  tags: ['autodocs'],
  argTypes: {
    isActive: { control: 'boolean' },
  },
} satisfies Meta<typeof PillStatusField>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  name: 'Active (green)',
  args: {
    isActive: true,
  },
}

export const Inactive: Story = {
  name: 'Inactive (yellow)',
  args: {
    isActive: false,
  },
}
