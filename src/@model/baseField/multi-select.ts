import { Component } from 'vue'
import { OptionsItem } from '../../@model'
import MultiSelectField from '../../components/templates/FieldGenerator/_components/MultiSelectField.vue'
import { IASelectBaseField, ASelectBaseField, SelectValue, ITransformFieldOptions } from './base'

export interface IMultiSelectBaseField<T> extends IASelectBaseField<T> {
  readonly value?: T[] | SelectValue[] | null
}

export class MultiSelectBaseField<T extends OptionsItem = OptionsItem>
  extends ASelectBaseField<T>
  implements IMultiSelectBaseField<T>
{
  readonly component: Component = MultiSelectField
  protected _value?: T[] | SelectValue[] | null

  constructor(field: IMultiSelectBaseField<T>) {
    super(field)
    this._value = field.value
  }

  transformField(options: ITransformFieldOptions = {}) {
    const { trackBy = 'id' } = options
    const value = this.value?.map((item: SelectValue) => item[trackBy] ?? item)

    return value ?? []
  }
}
