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

export const testOnExistTextByTestId = ({
  wrapper, testId,
}: { wrapper: VueWrapper; testId: string }, expectedValue: string) => {
  const domeElement = setWrapper(wrapper)

  return expect(domeElement(testId).text()).toBe(expectedValue)
}

export const testOnExistClassesByTestId = ({
  wrapper, testId,
}: { wrapper: VueWrapper; testId: string }, expectedValue: Array<string>) => {
  const domeElement = setWrapper(wrapper)

  return expect(domeElement(testId).classes()).toEqual(expect.arrayContaining(expectedValue))
}

export const testOnExistClassesInWrapper = (wrapper: VueWrapper, expectedValue: Array<string>) => {
  return expect(wrapper.classes()).toEqual(expect.arrayContaining(expectedValue))
}
