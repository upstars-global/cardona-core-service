import { Component } from 'vue'
import { IASelectBaseField, ASelectBaseField, SelectValue, ITransformFieldOptions } from './base'
import { OptionsItem } from '../../@model'
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue'

export enum OptionsPlacement {
  Top = 'top',
  Bottom = 'bottom',
  Right = 'Right',
  Left = 'Left',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  RightStart = 'right-start',
  RightEnd = 'right-end',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
  Auto = 'auto',
  AutoStart = 'auto-start',
  AutoEnd = 'auto-end',
}

interface ISelectTransformFieldOptions extends ITransformFieldOptions {
  isStringDefaultValue?: boolean
}

export interface ISelectBaseField<T> extends IASelectBaseField<T> {
  readonly value?: T | SelectValue | null
  readonly clearable?: boolean
  readonly withCalculatePosition?: boolean
  readonly placement?: OptionsPlacement
}

export class SelectBaseField<T extends OptionsItem = OptionsItem>
  extends ASelectBaseField<T>
  implements ISelectBaseField<T>
{
  readonly component: Component = SelectField
  protected _value?: T | SelectValue | null
  readonly clearable: boolean
  readonly withCalculatePosition: boolean
  readonly placement?: OptionsPlacement

  constructor(field: ISelectBaseField<T>) {
    super(field)
    this._value = field.value
    this.clearable = field.clearable ?? true
    this.withCalculatePosition = !!field.withCalculatePosition
    this.placement = field.placement ?? OptionsPlacement.Bottom
  }

  transformField(options: ISelectTransformFieldOptions = {}) {
    const { trackBy = 'id', isStringDefaultValue = true } = options
    const value = this.value?.[trackBy] ?? this.value

    return value || !isStringDefaultValue ? value : ''
  }
}
