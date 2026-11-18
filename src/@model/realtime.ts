/*
 * The connection token Centrifugo accepts for a cookie session. Issued by
 * the backoffice for the operator the Internal-JWT names, short-lived, and
 * deliberately not an API credential: the backoffice refuses it as a bearer.
 */
export const REALTIME_TOKEN_TYPE = 'App.V2.Realtime.Token'

export interface IRealtimeTokenData {
  token: string

  // Unix seconds. Informational only: Centrifugo reads `exp` from the token
  // itself and asks `getToken` for a new one when it is due.
  expiresAt: number
}

export class RealtimeToken {
  readonly token: string
  readonly expiresAt: number

  constructor(data: IRealtimeTokenData) {
    this.token = data?.token ?? ''
    this.expiresAt = data?.expiresAt ?? 0
  }
}
