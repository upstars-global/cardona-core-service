import { getAccessToken, getRefreshToken } from 'axios-jwt'
import store from '../../store'
import { checkIsLoggedIn } from '../../helpers/token-auth'
import { messageTypes } from './config'
import { Centrifuge } from 'centrifuge'

export enum TyperRequest {
  Updated = 'updated',
  Created = 'created',
  Deleted = 'deleted'
}

class WSService {
  static ws: null | Centrifuge = null
  static WSListSubscribe: Set<string> = new Set()

  static readonly maxTimeReconnect: number = 60000
  static async connect(channel) {
    if (!checkIsLoggedIn() || !getAccessToken())
      return

    // ws://localhost:63650/connection/websocket (lens link port)
    // wss://${location.host || location.hostname}/ws
    const client = new Centrifuge(`wss://${location.host || location.hostname}/ws`, {
      token: getAccessToken(),
      debug: true,
    })
    if(channel) {
      //Subscribe channel
      for (var keyChannel in channel) {
        client.newSubscription(channel[keyChannel])
          .on('publication', function(ctx) {
            WSService.parseData(ctx);
          });
      }
    }

    client.on('error', async function(ctx) {
      console.log(ctx?.error?.message ? `ERROR: ${ctx?.error?.message} / Type: ${ctx?.type}` : ctx)
      await store.dispatch('authCore/refreshAuth', getRefreshToken())
    })

    client.on('subscribed', function(ctx) {
      console.log('subscribed to server-side channel', ctx.channel)
    })

    client.on('subscribing', function(ctx) {
      console.log('subscribing to server-side channel', ctx.channel)
    })

    client.on('unsubscribed', function(ctx) {
      console.log('unsubscribed from server-side channel', ctx.channel)
    })

    client.on('publication', function(ctx) {
      console.log('publication receive from server-side channel', ctx)
      WSService.parseData(JSON.parse(ctx.data))
    })

    client.on('connecting', function(ctx) {
      console.log('connecting', ctx)
    });

    client.on('connected', function(ctx) {
      if (WSService.WSListSubscribe?.size) {
        WSService.WSListSubscribe.forEach(subChannel => {
          client?._subs?.[subChannel]?.subscribe()
        })
      }
    });

    client.connect();

    this.ws = client
    return client
  }

  static disconnect = () => {
    this.ws?.disconnect();
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
      }, 500);
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

  static async parseData( message ) {
    if (!message?.channel) return

    const channel = message?.channel.replace('-feed', '')
    const type = message?.data?.type
    const data = message?.data

    if (type === TyperRequest.Created || type === TyperRequest.Updated) {
      await store.dispatch(`${channel}/setWSData`, data)
    } else if (type === TyperRequest.Deleted) {
      await store.dispatch(`${channel}/deleteWSData`, data)
    }
  }
}

export default WSService
export { messageTypes }
