import { mount } from '@vue/test-utils'

export const getSelectorTestId = (testId: string): string => `[test-id="${testId}"]`
export const getProps = (params: Record<string, any>) => ({ props: params })
export const setMountComponent = (component: unknown) => (props: unknown) => mount(component, getProps(props))
export const setDefaultPropsParams = (defaultPropsParams: object = {}) => (propsParams: object = {}) => getProps({ ...defaultPropsParams, ...propsParams })
