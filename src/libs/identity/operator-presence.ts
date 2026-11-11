/*
 * Whether an operator is in, for the parts of the app that start something
 * on it (activity tracking, the notification socket). The legacy sign-in
 * says so through `authCore.isAuthorized`, set from its token pair; a cookie
 * session has no pair and is asked directly. The vendored flag is not
 * written for a session on purpose: the vendored ApiService reads it to
 * decide when an error envelope means "sign out".
 */
export const isOperatorIn = (legacySignedIn: boolean, sessionEstablished: boolean): boolean =>
  legacySignedIn || sessionEstablished
