import type { Component } from 'vue'
import type { OptionsItem } from '../../../@model'
import SelectField from '../../../components/templates/FieldGenerator/_components/SelectField.vue'
import type { IASelectBaseField, ITransformFieldOptions, SelectValue } from './base'
import { ASelectBaseField } from './base'

interface ISelectTransformFieldOptions extends ITransformFieldOptions {
  isStringDefaultValue?: boolean
}

export interface ISelectBaseField<T> extends IASelectBaseField<T> {
  readonly value?: T | SelectValue | null
  readonly clearable?: boolean
  readonly withCalculatePosition?: boolean
}

export class SelectBaseField<T extends OptionsItem = OptionsItem>
  extends ASelectBaseField<T>
  implements ISelectBaseField<T> {
  readonly component: Component = SelectField
  protected _value?: T | SelectValue | null
  readonly clearable: boolean
  readonly withCalculatePosition: boolean

  constructor(field: ISelectBaseField<T>) {
    super(field)
    this._value = field.value
    this.clearable = field.clearable ?? true
    this.withCalculatePosition = field?.withCalculatePosition ?? false
  }

  transformField(options: ISelectTransformFieldOptions = {}) {
    const { trackBy = 'id', isStringDefaultValue = true } = options
    const value = this.value?.[trackBy] ?? this.value

    return value || !isStringDefaultValue ? value : ''
  }
}
