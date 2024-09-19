import { type BaseWrapper, type VueWrapper, mount } from '@vue/test-utils'
import { expect } from 'vitest'

export const getSelectorTestId = (testId: string): string => `[data-test-id="${testId}"]`

export const getProps = (params: Record<string, any>) => ({ props: params })

export const setMountComponent = (component: unknown) => (props: unknown) => mount(component, getProps(props))

export const setDefaultPropsParams = (defaultPropsParams: object = {}) => (propsParams: object = {}) => getProps({ ...defaultPropsParams, ...propsParams })

export const getComponentFromWrapper = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.findComponent({ name })

export const findByTestId = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.find(getSelectorTestId(name))

export const setWrapper = (wrapper: VueWrapper) => (testId: string): BaseWrapper<Node> => findByTestId(wrapper, testId)

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
}

interface TestCaseGeneratorParams {
  property: WrapperProperties
  methodExpect: ExpectMethods
  withNot?: boolean
}

interface GetWrapperElementPrams {
  wrapper: VueWrapper
  testId?: string
  component?: string
}

export const getWrapperElement = (
  { wrapper, testId = '' }: GetWrapperElementPrams,
): BaseWrapper<Node> | VueWrapper => testId
  ? findByTestId(wrapper, testId)
  : wrapper

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

export const testOnNotExistText = testCaseGenerator({
  property: WrapperProperties.Text,
  methodExpect: ExpectMethods.ToBeFalsy,
})

export const testOnExistTextValue = testCaseGenerator({
  property: WrapperProperties.Text,
  methodExpect: ExpectMethods.ToContain,
})

export const testOnNotExistTextValue = testCaseGenerator({
  property: WrapperProperties.Text,
  methodExpect: ExpectMethods.ToContain,
  withNot: true,
})

export const testOnExistClass = testCaseGenerator({
  property: WrapperProperties.Classes,
  methodExpect: ExpectMethods.ToContain,
})
export const testOnNotExistClasses = testCaseGenerator({
  property: WrapperProperties.Classes,
  methodExpect: ExpectMethods.ToContain,
  withNot: true,
})

export const testOnEqualTextValue = testCaseGenerator({
  property: WrapperProperties.Text,
  methodExpect: ExpectMethods.ToEqual,
})

export const testOnExistElement = testCaseGenerator({
  property: WrapperProperties.Exists,
  methodExpect: ExpectMethods.ToBeTruthy,
})

export const testOnNotExistElement = testCaseGenerator({
  property: WrapperProperties.Exists,
  methodExpect: ExpectMethods.ToBeTruthy,
  withNot: true,
})
