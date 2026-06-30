import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { VColors } from '../../@model/vuetify'
import StatusField from '../../components/templates/BaseList/_components/fields/StatusField.vue'

/**
 * Used in BaseList (default.vue / compact.vue) via ListFieldType.Status,
 * in StatusWithDateField, and in ViewGenerator/StatusView.
 *
 * In all real usages only `value` is passed — never `variant` or `rounded`.
 * Value is either:
 *   - a plain string (e.g. 'active', 'pending_review') — underscores auto-replaced with spaces
 *   - an object { status: string, variant: VColors } for colored chips
 *
 * Text is auto-formatted: underscores → spaces, first letter uppercased.
 */
const meta = {
  title: 'Fields/StatusField',
  component: StatusField,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusField>

export default meta
type Story = StoryObj<typeof meta>

export const StringValue: Story = {
  name: 'String Value',
  args: {
    value: 'active',
  },
}

export const UnderscoreFormatting: Story = {
  name: 'Underscore → Space (auto-formatted)',
  args: {
    value: 'pending_review',
  },
}

export const ObjectSuccess: Story = {
  name: 'Object — Success',
  args: {
    value: { status: 'completed', variant: VColors.Success },
  },
}

export const ObjectWarning: Story = {
  name: 'Object — Warning',
  args: {
    value: { status: 'pending', variant: VColors.Warning },
  },
}

export const ObjectError: Story = {
  name: 'Object — Error',
  args: {
    value: { status: 'failed', variant: VColors.Error },
  },
}

export const ObjectInfo: Story = {
  name: 'Object — Info',
  args: {
    value: { status: 'in_progress', variant: VColors.Info },
  },
}
