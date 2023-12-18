import { Component } from 'vue'
import { BaseField, IBaseField } from './base'
import TagsField from "@/components/templates/FieldGenerator/_components/TagsField.vue";

export interface ITagsBaseField extends IBaseField {
  readonly value?: string[]
}

export class TagsBaseField extends BaseField implements ITagsBaseField {
  readonly component: Component = TagsField
  protected _value?: string[]

  constructor(field: ITagsBaseField) {
    super(field)
    this._value = field.value
  }

  transformField() {
    return this._value ?? []
  }
}
