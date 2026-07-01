import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TagsField from '../../components/templates/FieldGenerator/_components/TagsField.vue'
import { TagsBaseField } from '../../@model/templates/baseField'

/**
 * Tag input — type a value and press Space or Enter to add a chip.
 * Prevents duplicate tags (shows them highlighted in red).
 * Tags can be removed with the chip close button.
 */
const meta = {
  title: 'FieldGenerator/TagsField',
  component: TagsField,
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
} satisfies Meta<typeof TagsField>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Empty',
  args: {
    modelValue: [],
    field: new TagsBaseField({ key: 'tags', label: 'Tags', placeholder: 'Add tag and press Space' }),
  },
}

export const WithTags: Story = {
  name: 'With tags',
  args: {
    modelValue: ['VIP', 'Slots', 'High-roller'],
    field: new TagsBaseField({ key: 'tags', label: 'Tags' }),
  },
}

export const WithError: Story = {
  name: 'With error',
  args: {
    modelValue: [],
    errors: true,
    field: new TagsBaseField({ key: 'tags', label: 'Tags' }),
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    modelValue: ['VIP', 'Premium'],
    disabled: true,
    field: new TagsBaseField({ key: 'tags', label: 'Tags' }),
  },
}
