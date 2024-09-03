import {type BaseWrapper, mount, type VueWrapper} from '@vue/test-utils'

export const getSelectorTestId = (testId: string): string => `[test-id="${testId}"]`
export const getProps = (params: Record<string, any>) => ({ props: params })
export const setMountComponent = (component: unknown) => (props: unknown) => mount(component, getProps(props))
export const setDefaultPropsParams = (defaultPropsParams: object = {}) => (propsParams: object = {}) => getProps({ ...defaultPropsParams, ...propsParams })
export const getComponentFromWrapper = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.findComponent({ name })
