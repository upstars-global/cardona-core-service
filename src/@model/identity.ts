/*
 * The vocabulary of the operator's session. The credential is an HttpOnly
 * cookie the edge converts into `Authorization: Bearer`; the app never sees
 * a token. It only calls `GET /api/auth/session` before the first protected
 * request and once in answer to a refusal, then repeats the request once.
 */

// Proxied by the edge to the issuer with the provider's assertion intact.
export const SESSION_ENDPOINT = '/api/auth/session'

// Answered by the edge itself: it expires the HttpOnly cookie the page
// cannot touch. Accepts an anonymous call, so an expired session signs out.
export const LOGOUT_ENDPOINT = '/api/auth/logout'

/*
 * Why an operator was refused. The issuer answers every refusal with the
 * same body, so the status code is the only thing that separates the cases;
 * two of them are not statuses at all and need wording of their own.
 */
export enum IdentityRefusal {
  AccessNotConfirmed = 'accessNotConfirmed',
  AccessNotGranted = 'accessNotGranted',
  RegistryUnavailable = 'registryUnavailable',

  // The session route answered something no party in this path speaks,
  // most likely a 404 because the route was proxied to the backoffice
  // instead of the issuer. A deployment fault, not an outage.
  SessionNotConfigured = 'sessionNotConfigured',

  // The access provider's own session is gone. Only a full page navigation
  // can fix it, and the app asks before performing one.
  ProviderSignInNeeded = 'providerSignInNeeded',

  // The page was already handed to the provider once and access still
  // cannot be confirmed; reloading again would give the same result.
  SignInDidNotHelp = 'signInDidNotHelp',
}

export interface IIdentityRefusalData {
  readonly code: IdentityRefusal
  readonly requestId: string

  // Only what the session route answered: for `SessionNotConfigured` the
  // number is the useful half of the message.
  readonly status?: number
}

/*
 * Deliberately not one of the four types the vendored ApiService treats as
 * "the session died" (UNAUTHORIZED, BAD_CREDENTIALS, TOKEN_EXPIRED,
 * TOKEN_INVALID): those clear the vendored session and push the operator
 * to the password screen.
 */
export const IDENTITY_REFUSED_TYPE = 'IDENTITY_SESSION_REFUSED'

/*
 * `ApiService.showError` picks its branch off `validationErrors`,
 * `description`, `type` and `isAxiosError`; a plain Error matches none of
 * them, so it fires no toast while the panel stays empty. Carrying `type`
 * puts the explanation on screen.
 */
export class IdentityRefusedError extends Error {
  readonly type = IDENTITY_REFUSED_TYPE
  readonly code: IdentityRefusal
  readonly requestId: string

  constructor(refusal: Pick<IIdentityRefusalData, 'code'> & Partial<IIdentityRefusalData>) {
    super(`identity refused: ${refusal.code}`)

    this.name = 'IdentityRefusedError'
    this.code = refusal.code
    this.requestId = refusal.requestId ?? ''
  }
}

/*
 * The refusals a fresh session might fix. The edge and the issuer refuse
 * with HTTP 401; the backoffice serialises an expired credential as HTTP 200
 * carrying `error.type: TOKEN_INVALID`, so the body is checked as well.
 *
 * `UNAUTHORIZED` is deliberately absent: the backoffice uses it for a
 * permissions verdict, which a new session cannot change.
 */
const REFUSED_CREDENTIAL_TYPES = ['TOKEN_EXPIRED', 'TOKEN_INVALID']

export const isCredentialRefused = (status?: number, body?: any): boolean =>
  status === 401 || REFUSED_CREDENTIAL_TYPES.includes(body?.error?.type)

/*
 * The backoffice could not check the credential at all (its copy of the
 * issuer's keys is unreachable) and says so with HTTP 200 as well. A new
 * session would not help; what helps is the operator trying again later,
 * the same remedy an unreachable issuer gets.
 */
const REGISTRY_UNAVAILABLE_TYPE = 'IDENTITY_PROVIDER_UNAVAILABLE'

export const isRegistryUnavailable = (body?: any): boolean =>
  body?.error?.type === REGISTRY_UNAVAILABLE_TYPE

/*
 * CF Access fronts all traffic. When its own session expires it answers the
 * next request with a cross-origin redirect to its sign-in page, which the
 * browser will not let a script read, so axios reports `ERR_NETWORK` with
 * no `response`, exactly as for a CORS failure or a dead network. There is
 * no narrower discriminator, which is why nothing downstream may navigate
 * on its own: the app records `ProviderSignInNeeded` and offers the
 * navigation. Timeouts and aborts are excluded because those answers are ours.
 */
export const isProviderChallenge = (error: any): boolean =>
  Boolean(error) && !error.response && error.code === 'ERR_NETWORK'

// `401`: the credential was not accepted, and going back to the provider is
// what helps. `403`: it was accepted and the person still may not act.
const UNREACHABLE_STATUSES = [502, 503, 504]

export const refusalForStatus = (status?: number): IdentityRefusal => {
  if (status === 401)
    return IdentityRefusal.AccessNotConfirmed

  if (status === 403)
    return IdentityRefusal.AccessNotGranted

  // No status at all is a timeout or a dead socket, the same fact the
  // issuer's fail-closed 503 states; 502/504 are that fact told by an edge.
  if (status === undefined || UNREACHABLE_STATUSES.includes(status))
    return IdentityRefusal.RegistryUnavailable

  // The edge rate-limits this route. A 429 is "not right now", retryable
  // like an outage; reading it as "not set up" would show a deployment
  // error for a busy office.
  if (status === 429)
    return IdentityRefusal.RegistryUnavailable

  // Anything else came from something that is not the issuer, typically a
  // 404 from the backoffice. Dressing that up as an outage puts a "try
  // again" button on screen that can never succeed.
  return IdentityRefusal.SessionNotConfigured
}
