import type { Component } from 'vue'
import { markRaw } from 'vue'
import TagsField from '../../../components/templates/FieldGenerator/_components/TagsField.vue'
import type { IBaseField } from './base'
import { BaseField } from './base'

export interface ITagsBaseField extends IBaseField {
  readonly value?: string[] | number[]
}

export class TagsBaseField extends BaseField implements ITagsBaseField {
  readonly component: Component = markRaw(TagsField)
  protected _value?: string[] | number[] = []

  constructor(field: ITagsBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? []
  }
}
