/*
 * The notification socket (Centrifugo) for both ways in.
 *
 * The vendored `WSService.connect` authenticates with the legacy access
 * token it reads from localStorage and returns silently when there is none,
 * which is always the case for a cookie session: the Internal-JWT is
 * HttpOnly. So a session builds its own client here, with a connection
 * token the backoffice issues for the operator the cookie names, and hands
 * it to `WSService` so the pages keep using `subscribe`/`unsubscribe`/
 * `publish` unchanged. The core service is a dependency and is not edited.
 */
import { Centrifuge, State, UnauthorizedError } from 'centrifuge'
import WSService from '../../services/ws'
import { IS_DEV_ENV, LENS_PORT } from '../../utils/constants'
import { IdentityRefusedError } from '../../@model/identity'
import { REALTIME_TOKEN_TYPE } from '../../@model/realtime'
import { useRealtimeStore } from '../../stores/realtime'

type Channels = Record<string, string>
type ChannelStores = Record<string, any>

// The same endpoint `WSService.connect` uses, so the edge sees no difference.
export const realtimeUrl = (): string => IS_DEV_ENV
  ? `ws://localhost:${LENS_PORT}/connection/websocket`
  : `wss://${location.host || location.hostname}/ws`

/*
 * Called by Centrifugo on connect and whenever the token is due. A refused
 * session is final until the operator acts, so it becomes UnauthorizedError,
 * which stops Centrifugo reconnecting; anything else is thrown as it is and
 * Centrifugo retries with its own backoff. An empty token is one of those:
 * returned as it is, Centrifugo would take it as "unauthorized" and stop
 * for good over what is a malformed answer, not a verdict.
 */
const getToken = async (): Promise<string> => {
  let token: string

  try {
    token = (await useRealtimeStore().fetchConnectionToken()).token
  }
  catch (error) {
    if (error instanceof IdentityRefusedError)
      throw new UnauthorizedError(error.message)

    throw error
  }

  if (!token)
    throw new Error(`${REALTIME_TOKEN_TYPE} answered without a token`)

  return token
}

const connectSession = (channels: Channels, stores: ChannelStores): Centrifuge => {
  /*
   * One client per session: a second call while it is up or on its way up
   * changes nothing. A client that has stopped (the session ended, or
   * Centrifugo gave up after an unauthorized answer) is never revived; a
   * fresh one takes its place.
   */
  if (WSService.ws && WSService.ws.state !== State.Disconnected)
    return WSService.ws

  WSService.stores = stores

  // No initial token: Centrifugo asks `getToken` before the first connect.
  const client = new Centrifuge(realtimeUrl(), { getToken })

  // Allocated, not subscribed: the pages subscribe through `WSService`,
  // which looks the subscription up by channel, as with the legacy client.
  Object.values(channels).forEach(channel => {
    client.newSubscription(channel).on('publication', ctx => {
      WSService.parseData(ctx)
    })
  })

  // A page that asked before the client existed is subscribed once it is up.
  client.on('connected', () => {
    WSService.WSListSubscribe.forEach(channel => {
      client.getSubscription(channel)?.subscribe()
    })
  })

  // Centrifugo reconnects on its own after a transient drop; this is the one
  // trace of a client that stopped and will stay stopped until the session
  // comes back.
  client.on('disconnected', ctx => {
    console.warn(`realtime: disconnected, code ${ctx.code}: ${ctx.reason}`)
  })

  WSService.ws = client

  client.connect()

  return client
}

/*
 * Disconnected, and deliberately left in `WSService.ws`, as the legacy client
 * is: a page unmounting after the session ended still reaches it through
 * `WSService.unsubscribe`, which returns early without a client and would
 * leave its channel in `WSListSubscribe` for the next client to resubscribe
 * on every page. `connectSession` replaces it by its state.
 */
export const disconnectSession = (): void => {
  WSService.ws?.disconnect()
}

/*
 * Which "operator is in" the socket follows. A cookie session never sets the
 * legacy flag (see `./operator-presence`), so in session mode only the
 * session counts; the legacy sign-in keeps its own flag.
 */
export const isRealtimeOperatorIn = (
  sessionMode: boolean,
  { legacySignedIn, sessionEstablished }: { legacySignedIn: boolean; sessionEstablished: boolean },
): boolean => sessionMode ? sessionEstablished : legacySignedIn

/*
 * What `App.vue` runs whenever the operator comes in or goes out. A cookie
 * session never reaches `WSService.connect`: it would return without
 * connecting, and with a legacy pair left in storage it would connect as
 * somebody the session may not be.
 */
export const syncRealtime = async (
  isOperatorIn: boolean,
  { sessionMode, channels, stores }: { sessionMode: boolean; channels: Channels; stores: ChannelStores },
): Promise<void> => {
  if (sessionMode) {
    if (isOperatorIn)
      connectSession(channels, stores)
    else
      disconnectSession()

    return
  }

  if (isOperatorIn)
    await WSService.connect(channels, { stores })
  else
    await WSService.disconnect()
}
