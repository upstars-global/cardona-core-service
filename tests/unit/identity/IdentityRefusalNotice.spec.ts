import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { clickTrigger, setMountComponent } from '../utils'
import { IdentityRefusal } from '../../../src/@model/identity'
import { i18n } from '../../../src/plugins/i18n'
import IdentityRefusalNotice from '../../../src/components/IdentityRefusalNotice.vue'

const identityStore = vi.hoisted(() => ({
  refusal: null as { code: string; requestId: string; status?: number } | null,
  retry: vi.fn(),
  goToProvider: vi.fn(),
}))

const useIdentityStoreMock = vi.hoisted(() => vi.fn())
const signOutOfSessionMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/stores/identity', () => ({
  useIdentityStore: useIdentityStoreMock,
}))

vi.mock('../../../src/libs/identity/sign-out', () => ({
  signOutOfSession: signOutOfSessionMock,
}))

// jsdom refuses to navigate, and the retry reloads the page to make every
// request that failed while the session was refused happen again.
const reloadMock = vi.fn()

Object.defineProperty(window, 'location', {
  value: { ...window.location, reload: reloadMock },
  writable: true,
})

const TEST_IDS = {
  root: 'identity-refusal',
  title: 'identity-refusal-title',
  text: 'identity-refusal-text',
  requestId: 'identity-refusal-request-id',
  retry: 'identity-refusal-retry',
  signIn: 'identity-refusal-sign-in',
  signOut: 'identity-refusal-sign-out',
}

const getMountComponent = setMountComponent(IdentityRefusalNotice)

describe('IdentityRefusalNotice.vue', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    identityStore.refusal = null
    identityStore.retry.mockClear()
    identityStore.goToProvider.mockClear()
    useIdentityStoreMock.mockClear()
    useIdentityStoreMock.mockReturnValue(identityStore)
    signOutOfSessionMock.mockClear()
    reloadMock.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should show nothing while the session is fine', () => {
    testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.root })
  })

  // With the branch off this component must not so much as instantiate
  // the store.
  it('should not even reach for the store while the bootstrap branch is off', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    identityStore.refusal = { code: IdentityRefusal.AccessNotGranted, requestId: 'req-1' }

    testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.root })

    expect(useIdentityStoreMock).not.toHaveBeenCalled()
  })

  // Each case gets wording of its own rather than one shared apology.
  const cases = [
    IdentityRefusal.AccessNotConfirmed,
    IdentityRefusal.AccessNotGranted,
    IdentityRefusal.RegistryUnavailable,
    IdentityRefusal.SessionNotConfigured,
    IdentityRefusal.ProviderSignInNeeded,
    IdentityRefusal.SignInDidNotHelp,
  ]

  cases.forEach(code => {
    it(`should explain "${code}" in words of its own`, () => {
      identityStore.refusal = { code, requestId: '' }

      const wrapper = getMountComponent({})

      testOn.equalTextValue({ wrapper, testId: TEST_IDS.title }, i18n.t(`component.identityRefusal.${code}.title`))
      testOn.equalTextValue({ wrapper, testId: TEST_IDS.text }, i18n.t(`component.identityRefusal.${code}.text`, { status: '' }))
    })
  })

  it('should give every case an explanation of its own', () => {
    const titles = cases.map(code => i18n.t(`component.identityRefusal.${code}.title`))

    expect(new Set(titles).size).toBe(cases.length)
  })

  it('should name what the session route answered when the route is the problem', () => {
    identityStore.refusal = { code: IdentityRefusal.SessionNotConfigured, requestId: '', status: 404 }

    // The number is what tells support the route is not deployed rather
    // than that a service is down.
    testOn.existTextValue({ wrapper: getMountComponent({}), testId: TEST_IDS.text }, '404')
  })

  it('should offer the reference an operator can quote to support', () => {
    identityStore.refusal = { code: IdentityRefusal.AccessNotGranted, requestId: 'req-42' }

    testOn.existTextValue({ wrapper: getMountComponent({}), testId: TEST_IDS.requestId }, 'req-42')
  })

  it('should offer to try again only where trying again can help', () => {
    const notRetryable = [
      IdentityRefusal.AccessNotGranted,
      IdentityRefusal.AccessNotConfirmed,
      IdentityRefusal.SessionNotConfigured,
      IdentityRefusal.SignInDidNotHelp,
      IdentityRefusal.ProviderSignInNeeded,
    ]

    notRetryable.forEach(code => {
      identityStore.refusal = { code, requestId: '' }
      testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.retry })
    })

    identityStore.refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: '' }
    testOn.existElement({ wrapper: getMountComponent({}), testId: TEST_IDS.retry })
  })

  // The way back to the provider is a button: an unreadable answer may be
  // a blip on a background ping, and a self-reload would lose unsaved work.
  it('should offer the way back to the provider only where the provider is what is missing', () => {
    identityStore.refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: '' }
    testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.signIn })

    identityStore.refusal = { code: IdentityRefusal.SignInDidNotHelp, requestId: '' }
    testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.signIn })

    identityStore.refusal = { code: IdentityRefusal.ProviderSignInNeeded, requestId: '' }
    testOn.existElement({ wrapper: getMountComponent({}), testId: TEST_IDS.signIn })
  })

  // A blocked or unprovisioned account is not helped by signing in again
  // as the same person; the way out is another account, which starts with
  // leaving the provider's sessions. Nowhere else: a renewal, an outage or
  // a deployment fault are not about who the operator is.
  it('should offer to sign out and try another account only where the account itself was refused', () => {
    const notAboutTheAccount = [
      IdentityRefusal.AccessNotConfirmed,
      IdentityRefusal.RegistryUnavailable,
      IdentityRefusal.SessionNotConfigured,
      IdentityRefusal.ProviderSignInNeeded,
      IdentityRefusal.SignInDidNotHelp,
    ]

    notAboutTheAccount.forEach(code => {
      identityStore.refusal = { code, requestId: '' }
      testOn.notExistElement({ wrapper: getMountComponent({}), testId: TEST_IDS.signOut })
    })

    identityStore.refusal = { code: IdentityRefusal.AccessNotGranted, requestId: 'req-403' }

    const wrapper = getMountComponent({})

    testOn.existElement({ wrapper, testId: TEST_IDS.signOut })
    // The explanation stays: the button is added to it, not instead of it.
    testOn.equalTextValue({ wrapper, testId: TEST_IDS.text }, i18n.t(`component.identityRefusal.${IdentityRefusal.AccessNotGranted}.text`, { status: '' }))
  })

  it('should sign out of the session when the refused operator asks to try another account', async () => {
    identityStore.refusal = { code: IdentityRefusal.AccessNotGranted, requestId: 'req-403' }

    const wrapper = getMountComponent({})

    expect(signOutOfSessionMock).not.toHaveBeenCalled()

    await clickTrigger({ wrapper, testId: TEST_IDS.signOut })
    await flushPromises()

    expect(signOutOfSessionMock).toHaveBeenCalledTimes(1)
    expect(identityStore.goToProvider).not.toHaveBeenCalled()
  })

  it('should never navigate by itself', async () => {
    identityStore.refusal = { code: IdentityRefusal.ProviderSignInNeeded, requestId: '' }

    getMountComponent({})
    await flushPromises()

    expect(identityStore.goToProvider).not.toHaveBeenCalled()
    expect(reloadMock).not.toHaveBeenCalled()
  })

  it('should hand the page over when the operator presses the button', async () => {
    identityStore.refusal = { code: IdentityRefusal.ProviderSignInNeeded, requestId: '' }

    const wrapper = getMountComponent({})

    await clickTrigger({ wrapper, testId: TEST_IDS.signIn })
    await flushPromises()

    expect(identityStore.goToProvider).toHaveBeenCalledTimes(1)
  })

  it('should never retry by itself', async () => {
    identityStore.refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: '' }

    getMountComponent({})
    await flushPromises()

    // Only a person pressing the button asks again.
    expect(identityStore.retry).not.toHaveBeenCalled()
  })

  it('should ask the store to try again and make the page ask for its data again', async () => {
    identityStore.refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: '' }
    identityStore.retry.mockResolvedValueOnce(true)

    const wrapper = getMountComponent({})

    await clickTrigger({ wrapper, testId: TEST_IDS.retry })
    await flushPromises()

    expect(identityStore.retry).toHaveBeenCalledTimes(1)
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('should not reload when trying again did not help', async () => {
    identityStore.refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: '' }
    identityStore.retry.mockResolvedValueOnce(false)

    const wrapper = getMountComponent({})

    await clickTrigger({ wrapper, testId: TEST_IDS.retry })
    await flushPromises()

    expect(reloadMock).not.toHaveBeenCalled()
  })
})
