import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setMountComponent } from '../utils'
import { i18n } from '../../../src/plugins/i18n'
import ProvisionedNotice from '../../../src/components/ProvisionedNotice.vue'

const identityStore = vi.hoisted(() => ({
  provisioned: null as { requestId: string } | null,
}))

const useIdentityStoreMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/stores/identity', () => ({
  useIdentityStore: useIdentityStoreMock,
}))

const TEST_IDS = {
  root: 'provisioned-notice',
  requestId: 'provisioned-notice-request-id',
}

const getMountComponent = setMountComponent(ProvisionedNotice)

describe('ProvisionedNotice.vue', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    identityStore.provisioned = null
    useIdentityStoreMock.mockReset()
    useIdentityStoreMock.mockReturnValue(identityStore)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('renders nothing for an operator whose account already existed', () => {
    const wrapper = getMountComponent({})

    expect(wrapper.find(`[data-test-id="${TEST_IDS.root}"]`).exists()).toBe(false)
  })

  it('tells a freshly provisioned operator what happened, with the reference', () => {
    identityStore.provisioned = { requestId: 'req-new' }

    const wrapper = getMountComponent({})

    expect(wrapper.find(`[data-test-id="${TEST_IDS.root}"]`).text()).toContain(i18n.t('component.provisionedNotice.title'))
    expect(wrapper.find(`[data-test-id="${TEST_IDS.requestId}"]`).text()).toContain('req-new')
  })

  it('touches no store while the bootstrap branch is off', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    identityStore.provisioned = { requestId: 'req-new' }

    const wrapper = getMountComponent({})

    expect(useIdentityStoreMock).not.toHaveBeenCalled()
    expect(wrapper.find(`[data-test-id="${TEST_IDS.root}"]`).exists()).toBe(false)
  })
})
