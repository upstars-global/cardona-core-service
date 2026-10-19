/*
 * Two interceptors on the instance ApiService uses: make sure the session
 * exists before the first protected request, repeat a request once when it
 * turns out it did not, and record the refusal when the answer never came
 * from us. The store decides when to ask for a session and what a refusal
 * means.
 *
 * Nothing here touches `Authorization`: the credential is an HttpOnly cookie
 * the browser attaches and the edge converts. "Retry once" is only true
 * while there is one place that counts, so the retry must stay here.
 */
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from '../axios'
import type { IIdentityRefusalData } from '../../@model/identity'
import { IdentityRefusal, IdentityRefusedError, isCredentialRefused, isProviderChallenge, isRegistryUnavailable } from '../../@model/identity'
import { isSessionBootstrapEnabled } from '../../configs/identity'
import { forgetHandoff } from './identity-handoff'
import { dropDeadLegacyPair } from './legacy-pair'
import { requestIdOf } from './session-bootstrap'
import { useIdentityStore } from '../../stores/identity'

/*
 * Both markers ride on the request config rather than in a shared set, so
 * two requests failing at once cannot mistake each other's attempt for
 * their own. Plain string keys, not Symbols: re-dispatching runs the config
 * through axios's mergeConfig, which iterates Object.keys and would drop a
 * symbol-keyed marker, and a marker that silently fails to survive is a
 * retry loop.
 */
interface SessionRequestConfig extends InternalAxiosRequestConfig {
  __identitySessionRetried?: boolean
  __identitySessionGeneration?: number
}

const refusedError = (refusal: Pick<IIdentityRefusalData, 'code'> & Partial<IIdentityRefusalData>) =>
  new IdentityRefusedError(refusal)

const openSession = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (!isSessionBootstrapEnabled())
    return config

  const identity = useIdentityStore()

  // A recorded refusal is terminal until the operator acts; sending the
  // request anyway buys a round trip and a refusal that changes nothing.
  if (identity.refusal)
    throw refusedError(identity.refusal)

  if (!await identity.ensureSession())
    throw refusedError(identity.refusal ?? { code: IdentityRefusal.AccessNotConfirmed })

  const sessionConfig = config as SessionRequestConfig

  sessionConfig.__identitySessionGeneration = identity.generation

  return sessionConfig
}

/*
 * The second refusal in a row lands here with the marker already set and
 * leaves through the first branch, which is what makes "exactly one retry"
 * a property of the code rather than a count. The bootstrap itself never
 * reaches this function: it is sent by a client of its own that carries no
 * interceptors.
 */
const mayRepeat = async (config: SessionRequestConfig, response?: AxiosResponse): Promise<boolean> => {
  const identity = useIdentityStore()

  if (config.__identitySessionRetried) {
    // Refused twice, the second time under a freshly granted session. The
    // code is stated rather than derived from a status that, on the
    // backoffice's path, is 200.
    const requestId = requestIdOf(response)

    identity.recordRefusal({
      code: IdentityRefusal.AccessNotConfirmed,
      requestId,
    })

    identity.challenge(requestId)

    return false
  }

  config.__identitySessionRetried = true

  return await identity.renew(config.__identitySessionGeneration ?? -1)
}

// The backoffice answers a refused credential with HTTP 200 and puts the
// refusal in the body, so the success path is a real part of the retry.
const retryRefusedResponse = async (response: AxiosResponse): Promise<AxiosResponse> => {
  if (!isSessionBootstrapEnabled())
    return response

  const config = response.config as SessionRequestConfig

  // Not a verdict on the credential and not proof the path works either, so
  // the handoff marker stays; the refusal is retryable, like an outage.
  if (isRegistryUnavailable(response.data)) {
    const refusal = { code: IdentityRefusal.RegistryUnavailable, requestId: requestIdOf(response) }

    useIdentityStore().recordRefusal(refusal)

    throw refusedError(refusal)
  }

  if (!isCredentialRefused(response.status, response.data)) {
    // A protected request answered by us is the only proof that the whole
    // path works, so it alone settles an outstanding handoff. A granted
    // session is not proof that the backoffice accepts the credential.
    forgetHandoff()

    return response
  }

  if (await mayRepeat(config, response))
    return await axios.request(config)

  // Exhausted. This must leave as our error, never as the backoffice's
  // envelope: the vendored ApiService answers four envelope types with
  // clearAuth() + /login, and clearAuth() resets every store, including
  // the refusal recorded a moment ago.
  throw refusedError(useIdentityStore().refusal ?? {
    code: IdentityRefusal.AccessNotConfirmed,
    requestId: requestIdOf(response),
  })
}

const retryRefusedError = async (error: AxiosError): Promise<unknown> => {
  if (!isSessionBootstrapEnabled())
    throw error

  const config = error.config as SessionRequestConfig | undefined

  /*
   * Not our answer: CF Access serves an expired provider session as a
   * cross-origin redirect the browser will not let a script read, so there
   * is no status to match and no session of ours to renew. It is also
   * indistinguishable from a dropped connection, so the store probes before
   * it moves the page. Not awaited: the request itself is over either way,
   * and a burst of them must not hold the router guard for the probe's
   * patience.
   */
  if (config && isProviderChallenge(error)) {
    void useIdentityStore().followProviderChallenge()

    throw error
  }

  if (!config || !isCredentialRefused(error.response?.status, error.response?.data))
    throw error

  /*
   * Exhausted on this branch the error leaves as axios made it. That is safe
   * only because the vendored ApiService calls clearAuth() on four envelope
   * `type` values and one specific XMLHttpRequest TypeError, and an
   * AxiosError from a 401 is neither. If a future core-service clears auth
   * on a bare 401, convert to `refusedError` here or the refusal is wiped
   * before the notice renders.
   */
  if (!await mayRepeat(config, error.response))
    throw error

  return await axios.request(config)
}

export default function () {
  // A build with the branch off registers nothing: a check inside a handler
  // would still leave the handler on the instance and the store instantiated.
  if (!isSessionBootstrapEnabled())
    return

  dropDeadLegacyPair()

  // Registered after the existing mechanism's interceptor, which axios runs
  // in reverse order on requests, so the older one keeps the last word on
  // Authorization.
  axios.interceptors.request.use(openSession)
  axios.interceptors.response.use(retryRefusedResponse, retryRefusedError)
}
