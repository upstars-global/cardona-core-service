import { expect } from 'vitest'
import { has } from 'lodash'
import type { GetWrapperElementPrams } from '../../utils'
import { getWrapperElement } from '../../utils'
import {VueWrapper} from "@vue/test-utils";

export enum WrapperProperties {
  Exists = 'exists',
  Text = 'text',
  Html = 'html',
  Classes = 'classes',
  Attributes = 'attributes',
  IsVisible = 'isVisible',
  Length = 'length',
  Emitted = 'emitted',
  Element = 'element',

  // THIS WILL NEED IN FUTURE
  // Props = 'props',
  // SetData = 'setData',
  // SetProps = 'setProps',
  // Trigger = 'trigger',
  // Find = 'find',
  // FindAll = 'findAll',
  // Vm = 'vm',
  // Destroy = 'destroy',
}

export enum EventEmittersNames {
  UpdateVModel = 'update:modelValue',
  Show = 'show',
  Hide = 'hide',
}

export enum InputAttributes {
  Type = 'type',
  Name = 'name',
  Value = 'value',
  Id = 'id',
  Placeholder = 'placeholder',
  Disabled = 'disabled',
  ReadOnly = 'readonly',
  Required = 'required',
  Autocomplete = 'autocomplete',
  Autofocus = 'autofocus',
  Multiple = 'multiple',
  Accept = 'accept',
  Checked = 'checked',
  Src = 'src',
  Alt = 'alt',
  MaxLength = 'maxlength',

  // THIS WILL NEED IN FUTURE
  // Height = 'height',
  // Width = 'width',
  // Form = 'form',
  // List = 'list',
  // Spellcheck = 'spellcheck',
  // MinLength = 'minlength',
  // Min = 'min',
  // Max = 'max',
  // Step = 'step',
  // Pattern = 'pattern',
}

export enum ExpectMethods {
  ToBe = 'toBe',
  ToEqual = 'toEqual',
  ToContain = 'toContain',
  ToBeTruthy = 'toBeTruthy',
  ToBeFalsy = 'toBeFalsy',
  ToBeDefined = 'toBeDefined',
  ToBeUndefined = 'toBeUndefined',
  ToBeNull = 'toBeNull',
  ToBeInstanceOf = 'toBeInstanceOf',
  ToHaveLength = 'toHaveLength',
  ToMatch = 'toMatch',
  ToThrow = 'toThrow',
  ToHaveProperty = 'toHaveProperty',
  ToStrictEqual = 'toStrictEqual',
  ToBeGreaterThan = 'toBeGreaterThan',
  ToBeLessThan = 'toBeLessThan',
  ToHaveBeenCalledWith = 'toHaveBeenCalledWith',
  ToHaveBeenCalled = 'toHaveBeenCalled',
}

type WrapperPropertyValues = EventEmittersNames | EventEmittersNames | string | number

interface TestCaseGenerationProperty { name: WrapperProperties; value?: WrapperPropertyValues; callable?: boolean }

const getWrapperWithProperty = (wrapper, property?: TestCaseGenerationProperty) => {
  const { name = '', value = '', callable = true } = property || {}
  if (has(property, 'name')) {
    if (!callable)
      return value ? wrapper[name][value] : wrapper[name]

    return wrapper[name](value || '')
  }

  return wrapper
}

interface TestCaseGeneratorParams {
  property?: TestCaseGenerationProperty
  methodExpect: ExpectMethods
  withNot?: boolean
}

interface TestCaseGeneratorParams {
  property?: TestCaseGenerationProperty
  methodExpect: ExpectMethods
  withNot?: boolean
}

export const testCaseGenerator = ({
  property,
  methodExpect,
  withNot,
}: TestCaseGeneratorParams) => {
  return (wrapperElementPrams: GetWrapperElementPrams, expectedValue?: unknown) => {
    const elementTest = getWrapperElement(wrapperElementPrams)

    const wrapper = getWrapperWithProperty(elementTest, property)
    const expectation = withNot ? expect(wrapper).not : expect(wrapper)

    expectation[methodExpect](expectedValue)
  }
}

export const getWrapperWithId = (params: GetWrapperElementPrams) => params

export const testOn = {
  notExistText: testCaseGenerator({
    property: { name: WrapperProperties.Text },
    methodExpect: ExpectMethods.ToBeFalsy,
  }),

  existTextValue: testCaseGenerator({
    property: { name: WrapperProperties.Text },
    methodExpect: ExpectMethods.ToContain,
  }),

  notExistTextValue: testCaseGenerator({
    property: { name: WrapperProperties.Text },
    methodExpect: ExpectMethods.ToContain,
    withNot: true,
  }),

  existClass: testCaseGenerator({
    property: { name: WrapperProperties.Classes },
    methodExpect: ExpectMethods.ToContain,
  }),

  notExistClasses: testCaseGenerator({
    property: { name: WrapperProperties.Classes },
    methodExpect: ExpectMethods.ToContain,
    withNot: true,
  }),

  equalTextValue: testCaseGenerator({
    property: { name: WrapperProperties.Text },
    methodExpect: ExpectMethods.ToEqual,
  }),

  existElement: testCaseGenerator({
    property: { name: WrapperProperties.Exists },
    methodExpect: ExpectMethods.ToBeTruthy,
  }),

  notExistElement: testCaseGenerator({
    property: { name: WrapperProperties.Exists },
    methodExpect: ExpectMethods.ToBeTruthy,
    withNot: true,
  }),

  checkLengthElements: testCaseGenerator({
    methodExpect: ExpectMethods.ToHaveLength,
  }),

  checkExistCalledMethodWithArguments: testCaseGenerator({
    methodExpect: ExpectMethods.ToHaveBeenCalledWith,
  }),
  checkNotExistCalledMethod: testCaseGenerator({
    methodExpect: ExpectMethods.ToHaveBeenCalled,
    withNot: true,
  }),

  isEqual: testCaseGenerator({
    methodExpect: ExpectMethods.ToEqual,
  }),

  isEqualPlaceholder: testCaseGenerator({
    methodExpect: ExpectMethods.ToEqual,
    property: { name: WrapperProperties.Attributes, value: InputAttributes.Placeholder },
  }),

  isCalledEmittedEvent: testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Emitted, value: EventEmittersNames.UpdateVModel },
  }),

  isNotCalledEmittedEvent: testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Emitted, value: EventEmittersNames.UpdateVModel },
    withNot: true,
  }),

  isEqualEmittedValue: testCaseGenerator({
    methodExpect: ExpectMethods.ToEqual,
    property: { name: WrapperProperties.Emitted, value: EventEmittersNames.UpdateVModel },
  }),

  isDisabledElement: testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Element, value: InputAttributes.Disabled, callable: false },
  }),

  maxLengthAttributeToBe: testCaseGenerator({
    methodExpect: ExpectMethods.ToEqual,
    property: { name: WrapperProperties.Attributes, value: InputAttributes.MaxLength },
  }),

  inputAttributeValueToBe: testCaseGenerator({
    methodExpect: ExpectMethods.ToEqual,
    property: { name: WrapperProperties.Element, value: InputAttributes.Value, callable: false },
  }),

  isCalledEmitEventHide: testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Emitted, value: EventEmittersNames.Hide },
  }),
  isCalledEmitEvent: (wrapper: VueWrapper, actionEmit: string) => {
    testCaseGenerator({
      methodExpect: ExpectMethods.ToBeTruthy,
      property: { name: WrapperProperties.Emitted, value: actionEmit },
    })({ wrapper })
  },
}
