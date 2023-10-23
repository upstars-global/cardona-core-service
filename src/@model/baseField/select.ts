import { Component } from 'vue'
import { IASelectBaseField, ASelectBaseField, SelectValue, ITransformFieldOptions } from './base'
import { OptionsItem } from '../../@model'
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue'

interface ISelectTransformFieldOptions extends ITransformFieldOptions {
  isStringDefaultValue?: boolean
}

export interface ISelectBaseField<T> extends IASelectBaseField<T> {
  readonly value?: T | SelectValue | null
  readonly clearable?: boolean
}

export class SelectBaseField<T extends OptionsItem = OptionsItem>
  extends ASelectBaseField<T>
  implements ISelectBaseField<T>
{
  readonly component: Component = SelectField
  protected _value?: T | SelectValue | null
  readonly clearable: boolean

  constructor(field: ISelectBaseField<T>) {
    super(field)
    this._value = field.value
    this.clearable = field.clearable ?? true
  }

  transformField(options: ISelectTransformFieldOptions = {}) {
    const { trackBy = 'id', isStringDefaultValue = true } = options
    const value = this.value?.[trackBy] ?? this.value

    return value || !isStringDefaultValue ? value : ''
  }
}
