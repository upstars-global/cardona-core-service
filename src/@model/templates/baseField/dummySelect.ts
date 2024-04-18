import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { OptionsItem } from '../../../@model'
import DummySelectField from '../../../components/templates/FieldGenerator/_components/DummySelectField.vue'
import type { ISelectBaseField } from './select'
import { SelectBaseField } from './select'

export class DummySelectBaseField<T extends OptionsItem = OptionsItem>
  extends SelectBaseField<T>
  implements ISelectBaseField<T> {
  readonly component: Component = markRaw(DummySelectField)

  constructor(field: ISelectBaseField<T>) {
    super(field)
  }
}
