import { Component } from 'vue'
import { OptionsItem } from '../../../@model'
import { SelectBaseField, ISelectBaseField } from './select'
import DummySelectField from "../../../components/templates/FieldGenerator/_components/DummySelectField.vue";

export class DummySelectBaseField<T extends OptionsItem = OptionsItem>
  extends SelectBaseField<T>
  implements ISelectBaseField<T>
{
  readonly component: Component = DummySelectField

  constructor(field: ISelectBaseField<T>) {
    super(field)
  }
}
