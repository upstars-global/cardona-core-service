import { expect } from 'vitest'
import type { GetWrapperElementPrams } from '../../utils'
import { getWrapperElement } from '../../utils'

export enum WrapperProperties {
  Exists = 'exists',
  Text = 'text',
  Html = 'html',
  Classes = 'classes',
  Attributes = 'attributes',
  IsVisible = 'isVisible',
  Length = 'length',

  // THIS WILL NEED IN FUTURE
  // Props = 'props',
  // SetData = 'setData',
  // SetProps = 'setProps',
  // Trigger = 'trigger',
  // Find = 'find',
  // FindAll = 'findAll',
  // Emitted = 'emitted',
  // Vm = 'vm',
  // Destroy = 'destroy',
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

interface TestCaseGeneratorParams {
  property?: WrapperProperties
  methodExpect: ExpectMethods
  withNot?: boolean
}

const testCaseGenerator = ({
  property,
  methodExpect,
  withNot,
}: TestCaseGeneratorParams) => {
  return (wrapperElementPrams: GetWrapperElementPrams, expectedValue?: unknown) => {
    const elementTest = getWrapperElement(wrapperElementPrams)
    const wrapper = property ? elementTest[property]() : elementTest
    const expectation = withNot ? expect(wrapper).not : expect(wrapper)

    expectation[methodExpect](expectedValue)
  }
}

export const getWrapperWithId = (params: GetWrapperElementPrams) => params

export const testOn = {
  notExistText: testCaseGenerator({
    property: WrapperProperties.Text,
    methodExpect: ExpectMethods.ToBeFalsy,
  }),

  existTextValue: testCaseGenerator({
    property: WrapperProperties.Text,
    methodExpect: ExpectMethods.ToContain,
  }),

  notExistTextValue: testCaseGenerator({
    property: WrapperProperties.Text,
    methodExpect: ExpectMethods.ToContain,
    withNot: true,
  }),

  existClass: testCaseGenerator({
    property: WrapperProperties.Classes,
    methodExpect: ExpectMethods.ToContain,
  }),

  notExistClasses: testCaseGenerator({
    property: WrapperProperties.Classes,
    methodExpect: ExpectMethods.ToContain,
    withNot: true,
  }),

  equalTextValue: testCaseGenerator({
    property: WrapperProperties.Text,
    methodExpect: ExpectMethods.ToEqual,
  }),

  existElement: testCaseGenerator({
    property: WrapperProperties.Exists,
    methodExpect: ExpectMethods.ToBeTruthy,
  }),

  notExistElement: testCaseGenerator({
    property: WrapperProperties.Exists,
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
    withNot: true
  }),
}
