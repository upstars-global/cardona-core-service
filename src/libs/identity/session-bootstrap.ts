/*
 * The transport for `GET /api/auth/session`. Not an ApiService call: the
 * route answers with a `Set-Cookie` rather than a body and is not
 * addressable by an apispec `type`.
 */
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { IIdentityRefusalData } from '../../@model/identity'
import { LOGOUT_ENDPOINT, SESSION_ENDPOINT, refusalForStatus } from '../../@model/identity'

// A slow issuer would hold every request waiting behind the bootstrap; the
// edge already turns an unreachable one into a 503.
const SESSION_TIMEOUT_MS = 10_000

// The operator has clicked and is waiting; the edge answers this one itself,
// so a slow answer means it is not coming and the navigation goes ahead.
const LOGOUT_TIMEOUT_MS = 3_000

let issuerClient: AxiosInstance | null = null

/*
 * Interceptor-free by construction: the shared ApiService instance carries
 * the retry that calls this function, so a refused bootstrap sent through
 * it would ask the bootstrap to fix itself. Built on first use, so a build
 * with the branch off creates nothing.
 */
const client = (): AxiosInstance => {
  if (!issuerClient) {
    issuerClient = axios.create()

    // `axios.create` copies `axios.defaults`, where the existing way in
    // keeps `Authorization`. This request asks for a credential and must
    // not carry one.
    delete issuerClient.defaults.headers.common.Authorization
  }

  return issuerClient
}

/*
 * What a granted session says beyond the `Set-Cookie` the page cannot
 * read. The body is empty for an ordinary grant; it names the one case
 * the operator has to be told about — their account was just created and
 * holds no rights yet (ADR-026) — with the reference to quote.
 */
export interface ISessionGrantData {
  readonly provisioned: boolean
  readonly requestId: string
}

// Success is the absence of a throw; the token never appears in the body.
export const requestSession = async (): Promise<ISessionGrantData> => {
  const response = await client().get(SESSION_ENDPOINT, { timeout: SESSION_TIMEOUT_MS })

  return {
    provisioned: response?.data?.provisioned === true,
    requestId: requestIdOf(response),
  }
}

/*
 * Asks the edge to expire the session cookie. Through the same bare client:
 * a refusal here must not be retried by bootstrapping a session the operator
 * is leaving. Whether it worked is the caller's business, and the caller
 * signs out either way.
 */
export const endSession = async (): Promise<void> => {
  await client().post(LOGOUT_ENDPOINT, undefined, { timeout: LOGOUT_TIMEOUT_MS })
}

/*
 * What the session route answers when asked in a way the browser is allowed
 * to report. The ordinary bootstrap goes out as an XHR, and CF Access
 * answers an expired provider session with a cross-origin redirect that an
 * XHR must follow and then cannot read: the same `ERR_NETWORK` a dead
 * socket gives. `fetch` with `redirect: 'manual'` is told not to follow,
 * and so sees the redirect itself as an `opaqueredirect`, where a dead
 * socket throws. That is the one way a script can tell the provider's
 * challenge from no connection, and it is why a navigation may follow the
 * first and not the second.
 */
export enum SessionProbe {
  // The provider's challenge, for certain: only a full navigation answers it.
  Challenge = 'challenge',

  // The route was not reached at all.
  Offline = 'offline',
}

export const probeSession = async (): Promise<SessionProbe | number> => {
  // The route is counted by the edge's rate limit, and a hanging probe would
  // hold every refusal behind it, so it is given the bootstrap's patience
  // and then cut off: an aborted fetch rejects, which reads as offline.
  const patience = new AbortController()
  const timer = setTimeout(() => patience.abort(), SESSION_TIMEOUT_MS)

  try {
    const response = await fetch(SESSION_ENDPOINT, {
      redirect: 'manual',
      credentials: 'include',
      cache: 'no-store',
      signal: patience.signal,
    })

    return response.type === 'opaqueredirect' ? SessionProbe.Challenge : response.status
  }
  catch {
    return SessionProbe.Offline
  }
  finally {
    clearTimeout(timer)
  }
}

// Every party puts the request id at the top of the body (the issuer and
// the edge as `{error, requestId}`, the backoffice in its `ErrorResponse`),
// and the issuer repeats it in a header.
export const requestIdOf = (response: any): string =>
  response?.data?.requestId || response?.headers?.['x-request-id'] || ''

// The refusal a failed bootstrap stands for.
export const refusalFromError = (error: any): IIdentityRefusalData => ({
  code: refusalForStatus(error?.response?.status),
  requestId: requestIdOf(error?.response),
  status: error?.response?.status,
})
