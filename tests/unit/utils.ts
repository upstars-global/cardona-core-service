import { type BaseWrapper, type VueWrapper, mount } from '@vue/test-utils'

export const getSelectorTestId = (testId: string): string => `[data-test-id="${testId}"]`

export const getConfig = (props: Record<string, unknown>, global: Record<string, unknown>) => ({ props, global })

export const setMountComponent = (component: unknown) => (props: unknown, global = {}) => mount(component, getConfig(props, global))

export const getComponentFromWrapper = (
  wrapper: VueWrapper,
  name: string,
): BaseWrapper<Node> => wrapper.findComponent({ name })

export type WrapperResult = BaseWrapper<Node> | BaseWrapper<Node>[]

export const findByTestId = (
  wrapper: VueWrapper,
  name: string,
  params: { all: boolean } = { all: false },
): WrapperResult => {
  if (params?.all)
    return wrapper.findAll(getSelectorTestId(name))

  return wrapper.find(getSelectorTestId(name)) // This was missing
}

export interface GetWrapperElementPrams {
  wrapper: VueWrapper
  testId?: string
  selector?: string
  component?: string
  all?: boolean
}

export const getWrapperElement = (
  { wrapper, testId = '', selector = '', all = false }: GetWrapperElementPrams,
): WrapperResult => {
  if (testId)
    return findByTestId(wrapper, testId, { all })

  if (selector)
    return all ? wrapper.findAll(selector) : wrapper.find(selector)

  return wrapper
}
