import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DateField from '../../components/templates/BaseList/_components/fields/DateField.vue'

/**
 * Used in:
 *   - BaseList (default.vue / compact.vue) via ListFieldType.Date — receives `cell` (ISO string)
 *   - StatusWithDateField — receives `item.updatedAt` (ISO string)
 *   - DatePeriodField — receives `period.dateFrom` / `period.dateTo` (ISO strings)
 *
 * Renders via v-full-date directive which formats the Date object to a localized string.
 * Renders a dash "-" when date prop is empty/undefined.
 */
const meta = {
  title: 'Fields/DateField',
  component: DateField,
  tags: ['autodocs'],
  argTypes: {
    date: { control: 'text' },
  },
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const ISOString: Story = {
  name: 'ISO String (typical cell value)',
  args: {
    date: '2024-03-15T10:30:00.000Z',
  },
}

export const UpdatedAt: Story = {
  name: 'updatedAt Field',
  args: {
    date: '2024-06-01T08:45:22.000Z',
  },
}

export const DateFrom: Story = {
  name: 'dateFrom (period start)',
  args: {
    date: '2024-01-01T00:00:00.000Z',
  },
}

export const DateTo: Story = {
  name: 'dateTo (period end)',
  args: {
    date: '2024-12-31T23:59:59.000Z',
  },
}

export const Empty: Story = {
  name: 'Empty (renders dash)',
  args: {
    date: undefined,
  },
}
