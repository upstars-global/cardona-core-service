import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BadgesField from '../../components/templates/BaseList/_components/fields/BadgesField.vue'

/**
 * Used in BaseList (default.vue / compact.vue) via ListFieldType.Badges.
 * Receives `cell` — an array of objects from row data (e.g. tags field).
 *
 * Real data shape: { id: string, name: string, position?: number }
 * The component defaults badge color to VColors.Secondary when `color` is absent.
 * Slot #default="{ value }" allows custom badge rendering per item.
 */
const meta = {
  title: 'Fields/BadgesField',
  component: BadgesField,
  tags: ['autodocs'],
  argTypes: {
    countItemShowBadge: {
      control: 'number',
      description: 'Max visible badges before +N counter. Default: 2.',
    },
  },
} satisfies Meta<typeof BadgesField>

export default meta
type Story = StoryObj<typeof meta>

// Realistic data shape matching the project's tag objects
const realTags = [
  { id: '638f1a4c9bb32010930bf230', name: 'test', position: 3 },
  { id: '638f1a4c9bb32010930bf231', name: 'test 1', position: 23 },
  { id: '638f1a4c9bb32010930bf232', name: 'vip' },
  { id: '638f1a4c9bb32010930bf233', name: 'blocked' },
]

export const Default: Story = {
  name: 'Default (2 tags)',
  args: {
    listBadges: realTags.slice(0, 2),
  },
}

export const WithPosition: Story = {
  name: 'With Position Label',
  args: {
    listBadges: [
      { id: '1', name: 'test', position: 3 },
      { id: '2', name: 'test 1', position: 23 },
    ],
  },
}

export const OverflowCounter: Story = {
  name: 'Overflow Counter (+N)',
  args: {
    listBadges: realTags,
    countItemShowBadge: 2,
  },
}

export const SingleBadge: Story = {
  name: 'Single Badge',
  args: {
    listBadges: [{ id: '1', name: 'vip' }],
  },
}

export const Empty: Story = {
  name: 'Empty List',
  args: {
    listBadges: [],
  },
}
