import { type BaseWrapper, type VueWrapper, mount } from '@vue/test-utils'

export const getSelectorTestId = (testId: string): string => `[data-test-id="${testId}"]`

export const getProps = (params: Record<string, any>) => ({ props: params })

export const setMountComponent = (component: unknown) => (props: unknown) => mount(component, getProps(props))

export const getComponentFromWrapper = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.findComponent({ name })

export const findByTestId = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.find(getSelectorTestId(name))

export interface GetWrapperElementPrams {
  wrapper: VueWrapper
  testId?: string
  component?: string
}

export const getWrapperElement = (
  { wrapper, testId = '' }: GetWrapperElementPrams,
): BaseWrapper<Node> | VueWrapper => testId
  ? findByTestId(wrapper, testId)
  : wrapper
