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

const getElementOfTesting = ({ wrapper, testId }: { wrapper: VueWrapper; testId?: string }) => {
  if (!testId)
    return wrapper

  return findByTestId(wrapper, testId)
}

export const testOnExistText = ({
  wrapper, testId,
}: { wrapper: VueWrapper; testId?: string }, expectedValue: string) => {
  return expect(getElementOfTesting({ wrapper, testId }).text()).toBe(expectedValue)
}

export const testOnExistClasses = ({
  wrapper, testId,
}: { wrapper: VueWrapper; testId?: string }, expectedValue: Array<string>) => {
  return expect(getElementOfTesting({ wrapper, testId }).classes()).toEqual(expect.arrayContaining(expectedValue))
}

export enum ExpectMethods {
  ToBe = 'toBe',
  NotToBe = 'not.toBe',
  ToEqual = 'toEqual',
  NotToEqual = 'not.toEqual',
  ToContain = 'toContain',
  NotToContain = 'not.toContain',
  ToBeTruthy = 'toBeTruthy',
  ToBeFalsy = 'toBeFalsy',
}

// const dynamicExpect = <T = string>(
//   actualValue: unknown, // Фактическое значение, которое проверяется
//   method: ExpectMethods, // Метод из enum ExpectMethods
//   expectedValue?: T, // Ожидаемое значение, если необходимо
// ) => {
//   // Разделяем строку метода по точке (для работы с "not")
//   console.log(expectedValue)
//
//   return
//   const [mainMethod, subMethod] = method.split('.')
//
//   // Если в методе присутствует "not", вызываем expect().not, иначе обычный expect
//   const expectation = mainMethod === 'not' ? expect(actualValue).not : expect(actualValue)
//
//   // Динамический вызов метода: используем subMethod или mainMethod
//   if (subMethod) {
//     // Если метод содержит 'not' (например, 'not.toBe')
//     expectation[subMethod as keyof typeof expectation](expectedValue)
//   }
//   else {
//     // Обычный метод (например, 'toBe', 'toEqual')
//     expectation[mainMethod as keyof typeof expectation](expectedValue)
//   }
// }

export const testOnElement = <T = string>({
  wrapper,
  testId,
}: {
  wrapper: VueWrapper
  testId?: string
},
  caseOn: ExpectMethods,

  expectedValue?: T) => {
  const element = getElementOfTesting({ wrapper, testId })
  const [mainMethod, subMethod] = caseOn.split('.').reverse()
  if (subMethod) {
    console.log(subMethod, mainMethod, '!!!!!!')

    return
    expect(element)[subMethod][mainMethod]()
  }
  else {
    console.log(element.exists(), '!!!!!!')

    expect(element.text())[mainMethod]()
  }

  // dynamicExpect<T>(element, caseOn, expectedValue)
}

/// PLAN for method generation test case:

// 1. **Element Selection**:
//    - Choose the element to be tested.
//    - Options: the entire `wrapper` or a specific element selected by `testId`.
//
// 2. **Property of the Element**:
//    - Define the property of the element you want to check.
//    - Example properties: `.text()`, `.classes()`, `.exists()`, etc.
//
// 3. **Additional Condition** (Optional):
//    - Specify any additional condition like `not` for negating the check.
//    - Example: `not.toBe`, `not.toContain`, etc.
//
// 4. **Main Method of Checking**:
//    - The core method used to assert the property (e.g., `toBe`, `toEqual`, `toContain`).
//
// 5. **Expected Value**:
//    - The value that you expect the property to match (e.g., specific text, class, or boolean).
