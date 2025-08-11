import { getAccessToken, getRefreshToken } from 'axios-jwt'
import { Centrifuge } from 'centrifuge'
import { has } from 'lodash'
import store from '../../store'
import { checkIsLoggedIn } from '../../helpers/token-auth'
import { messageTypes } from './config'

export enum TyperRequest {
  Updated = 'updated',
  Created = 'created',
  Deleted = 'deleted',
}

class WSService {
  static ws: null | Centrifuge = null
  static WSListSubscribe: Set<string> = new Set()
  static WSchannel: null
  static stores: Record<string, any> = {}

  static async connect(channel, { needRefresh, stores }: { needRefresh?: boolean; stores: Record<string, any> }) {
    this.WSchannel = channel
    this.stores = stores
    if (!checkIsLoggedIn() || !getAccessToken() || !getRefreshToken())
      return

    async function getToken() {
      const data: {
        accessToken: string
        refreshToken: string
      } = await store.dispatch('authCore/refreshAuth', getRefreshToken())

      return data?.accessToken
    }

    let refreshAuthToken = null
    if (needRefresh)
      refreshAuthToken = await getToken()

    // ws://localhost:56316/connection/websocket (lens link port)
    // wss://${location.host || location.hostname}/ws
    const client = new Centrifuge(`wss://${location.host || location.hostname}/ws`, {
      debug: true,
      token: refreshAuthToken || getAccessToken(),
      getToken,
    })

    if (channel) {
      // Subscribe channel
      for (const keyChannel in channel) {
        const sub = client.newSubscription(channel[keyChannel])
          .on('publication', ctx => {
            WSService.parseData(ctx)
          })
      }
    }

    client.on('error', async ctx => {
      console.log(ctx?.error?.message ? `ERROR: ${ctx?.error?.message} / Type: ${ctx?.type}` : ctx)

      if (ctx?.error?.code === 109 || ctx?.error?.message === 'token expired') {
        if (WSService.WSchannel) {
          WSService.disconnect()
          WSService.connect(WSService.WSchannel, { stores, needRefresh: true })
        }
      }
    })

    client.on('subscribed', ctx => {
      console.log('subscribed to server-side channel', ctx.channel)
    })

    client.on('subscribing', ctx => {
      console.log('subscribing to server-side channel', ctx.channel)
    })

    client.on('unsubscribed', ctx => {
      console.log('unsubscribed from server-side channel', ctx.channel)
    })

    client.on('publication', ctx => {
      console.log('publication receive from server-side channel', ctx)
      WSService.parseData(JSON.parse(ctx.data))
    })

    client.on('connecting', async ctx => {
      console.log('connecting', ctx)
    })

    client.on('connected', ctx => {
      if (WSService.WSListSubscribe?.size) {
        WSService.WSListSubscribe.forEach(subChannel => {
          client?._subs?.[subChannel]?.subscribe()
        })
      }
    })

    client.connect()

    this.ws = client

    return client
  }

  static disconnect = () => {
    this.ws?.disconnect()
  }

  static send(text) {
    if (!this.ws)
      return

    this.ws.send(text)
  }

  static publish(channel, message) {
    if (!this.ws)
      return

    this.ws?.publish(channel, message)
  }

  static subscribe(channel) {
    this.WSListSubscribe.add(channel)
    if (!this.ws) {
      // If the connection is not established, we will try to connect again
      setTimeout(() => {
        WSService.ws?._subs?.[channel]?.subscribe()
      }, 500)

      return
    }

    this.ws?._subs?.[channel]?.subscribe()
  }

  static unsubscribe(channel) {
    if (!this.ws)
      return

    this.ws?._subs?.[channel]?.unsubscribe()
    this.WSListSubscribe.delete(channel)
  }

  static async parseData(message) {
    if (!message?.channel)
      return

    // const channel = message?.channel.replace('-feed', '')
    const type = message?.data?.type
    const data = message?.data

    console.debug('WSService.parseData', message)

    if (!has(this.stores, message?.channel))
      return
    const actualStore = this.stores[message?.channel]

    if (type === TyperRequest.Created)
      await actualStore.createWSData(data)
    else if (type === TyperRequest.Updated)
      await actualStore.setWSData(data)
    else if (type === TyperRequest.Deleted)
      await actualStore.deleteWSData(data)
  }
}

export default WSService
export { messageTypes }
