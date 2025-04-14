import { getAccessToken, getRefreshToken } from 'axios-jwt'
import store from '../../store'
import { checkIsLoggedIn } from '../../helpers/token-auth'
import { messageTypes } from './config'
import { WSTypePrefix } from '@productConfig'
import { Centrifuge } from 'centrifuge';

const DEFAULT_TIME_RECONNECT = 1000
const RECONNECTION_TIME_MULTIPLIER = 2

class WSService {
  static ws: null | WebSocket = null
  static WSListSubscribe: Set<string> = new Set()
  static timeReconnect: number = DEFAULT_TIME_RECONNECT
  static Channel = {
    Ping: 'ping',
  }

  static readonly maxTimeReconnect: number = 60000
  static async connect(channel) {
    if (!checkIsLoggedIn() && !channel)
      return
    this.Channel = channel

    if (!getAccessToken())
      return

    const { accessToken } = await store.dispatch('authCore/refreshAuth', getRefreshToken())
    //const url = `wss://${location.host || location.hostname}/ws?jwt=${accessToken}`
    //wss://centrifugo-staging-service.eqr.svc.cluster.local/connection/websocket

    console.log(accessToken);
    const client = new Centrifuge(`wss://centrifugo-staging-service.eqr.svc.cluster.local/connection/websocket`, {
      token: accessToken,
      debug: true
    });
    console.log(client)

    client.on('error', function(ctx) {
      console.log(ctx);
    });

    client.on('subscribed', function(ctx) {
      // Called when subscribed to a server-side channel upon Client moving to
      // connected state or during connection lifetime if server sends Subscribe
      // push message.
      console.log('subscribed to server-side channel', ctx.channel);
    });

    client.on('subscribing', function(ctx) {
      // Called when existing connection lost (Client reconnects) or Client
      // explicitly disconnected. Client continue keeping server-side subscription
      // registry with stream position information where applicable.
      console.log('subscribing to server-side channel', ctx.channel);
    });

    client.on('unsubscribed', function(ctx) {
      // Called when server sent unsubscribe push or server-side subscription
      // previously existed in SDK registry disappeared upon Client reconnect.
      console.log('unsubscribed from server-side channel', ctx.channel);
    });

    client.on('publication', function(ctx) {
      // Called when server sends Publication over server-side subscription.

      console.log('publication receive from server-side channel', ctx.channel, ctx.data);
      this.parseData(JSON.parse(ctx.data) as Array<any>);
    });

    client.connect();

    client.on('connected', function(ctx) {
      console.log(ctx);
      console.log('development/payouts-feed');
      client.newSubscription('development/payouts-feed');
    });
    this.ws = client
    // await new WebSocket(url)
    //
    // this.ws.onopen = () => {
    //   this.timeReconnect = DEFAULT_TIME_RECONNECT
    //   this.sendObj([messageTypes.SUBSCRIBE, this.Channel.Ping])
    //
    //   if (this.WSListSubscribe.size) {
    //     this.WSListSubscribe.forEach(event => {
    //       this.send(event)
    //     })
    //   }
    // }
    //
    // this.ws.onmessage = event => {
    //   this.parseData(JSON.parse(event.data) as Array<any>)
    // }
    //
    // this.ws.onclose = async event => {
    //   this.ws?.close()
    //   this.ws = null
    //   if (
    //     event.wasClean
    //     && (this.timeReconnect !== DEFAULT_TIME_RECONNECT || event.code === 1000)
    //   ) {
    //     this.WSListSubscribe.clear()
    //   }
    //   else {
    //     this.timeReconnect *= RECONNECTION_TIME_MULTIPLIER
    //     if (this.timeReconnect > this.maxTimeReconnect)
    //       this.timeReconnect = DEFAULT_TIME_RECONNECT
    //     setTimeout(() => this.connect(channel), this.timeReconnect)
    //   }
    //   console.log(`Код: ${event.code} причина: ${event.reason}`)
    // }
    //
    // this.ws.onerror = error => {
    //   console.log(error)
    // }
  }

  static disconnect = () => {
    this.ws?.close()
  }

  static send(text) {
    if (!this.ws)
      return
    this.ws.send(text)
    // if (this.ws.readyState === 1)
    //   this.ws.send(text)
    // else
    //   setTimeout(() => this.send(text), DEFAULT_TIME_RECONNECT)
    console.log(text)
  }

  static sendObj(message) {
    if (!this.ws)
      return

    console.log(message)
    this.send(JSON.stringify(message))
  }

  static subscribe(channel) {
    if (!this.ws)
      return

    // this.ws.newSubscription('development/payouts-feed');

    // const message = JSON.stringify([messageTypes.SUBSCRIBE, WSTypePrefix + channel])
    //
    // this.WSListSubscribe.add(message)
    // this.send(message)
  }

  static unsubscribe(channel) {
    if (!this.ws)
      return

    // const message = JSON.stringify([messageTypes.UNSUBSCRIBE, WSTypePrefix + channel])
    //
    // this.WSListSubscribe.delete(message)
    // this.send(message)
  }

  static async parseData(messageArray: Array<any>) {
    const [messageTypesData, channelDataSTR, data] = messageArray

    // if(channelDataSTR === this.Channel.Ping) {
    //   this.send('pong')
    // }

    if (messageTypesData === messageTypes.EVENT) {
      const channelData = String(channelDataSTR).replace(WSTypePrefix, '')

      if (channelData === 'ping')
        return
      await store.dispatch(`${channelData}/setWSData`, data)
    }
  }
}

export default WSService
export { messageTypes }
