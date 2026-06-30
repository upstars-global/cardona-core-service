import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CopyField from '../../components/templates/BaseList/_components/fields/CopyField.vue'

/**
 * Used in BaseList (default.vue / compact.vue) via ListFieldType.Copy.
 * Receives `cell` — a plain string value from the row.
 *
 * Renders: text + tabler-copy icon (16px). Click on icon calls copyToClipboard(value).
 * Renders nothing (v-if) when value is empty.
 *
 * Note: `isShort` prop exists but is NOT used anywhere in the project currently.
 */
const meta = {
  title: 'Fields/CopyField',
  component: CopyField,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    isShort: {
      control: 'boolean',
      description: 'Truncates value via getShortString(). Not used in BaseList currently.',
    },
  },
} satisfies Meta<typeof CopyField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'UUID Value',
  args: {
    value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
}

export const ShortText: Story = {
  name: 'Short Text',
  args: {
    value: 'REF-00123',
  },
}

export const LongValue: Story = {
  name: 'Long Value',
  args: {
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
  },
}

export const Empty: Story = {
  name: 'Empty Value (renders nothing)',
  args: {
    value: '',
  },
}
