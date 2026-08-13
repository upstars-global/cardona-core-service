import type { Component } from 'vue'
import { markRaw } from 'vue'
import GradientField from '../../../components/templates/FieldGenerator/_components/GradientField.vue'
import type { ITextareaBaseField } from './textarea'
import { TextareaBaseField } from './textarea'

export class GradientBaseField extends TextareaBaseField implements ITextareaBaseField {
  readonly component: Component = markRaw(GradientField)
}
