import { isLoggedIn, getAccessToken } from 'axios-jwt'
import { messageTypes } from './config'
import { WSTypePrefix } from '@productConfig'
import store from '../../store'

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
    if (!isLoggedIn() && !channel) return
    this.Channel = channel
    const JWT = getAccessToken()
    const url = `wss://${location.host || location.hostname}/ws?jwt=${JWT}`
    this.ws = await new WebSocket(url)

    this.ws.onopen = () => {
      this.timeReconnect = DEFAULT_TIME_RECONNECT
      this.sendObj([messageTypes.SUBSCRIBE, this.Channel.Ping])

      if (this.WSListSubscribe.size) {
        this.WSListSubscribe.forEach((event) => {
          this.send(event)
        })
      }
    }

    this.ws.onmessage = (event) => {
      this.parseData(JSON.parse(event.data) as Array<any>)
    }

    this.ws.onclose = (event) => {
      this.ws?.close()
      this.ws = null
      if (event.wasClean && this.timeReconnect !== DEFAULT_TIME_RECONNECT) {
        this.WSListSubscribe.clear()
        this.timeReconnect = DEFAULT_TIME_RECONNECT
      } else {
        this.timeReconnect *= RECONNECTION_TIME_MULTIPLIER
        if (this.timeReconnect > this.maxTimeReconnect) this.timeReconnect = DEFAULT_TIME_RECONNECT
        setTimeout(() => this.connect(channel), this.timeReconnect)
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason)
    }

    this.ws.onerror = (error) => {
      console.log(error)
    }
  }

  static disconnect = () => {
    this.ws?.close()
  }

  static send(text) {
    if (!this.ws) return

    if (this.ws.readyState === 1) {
      this.ws.send(text)
    } else {
      setTimeout(() => this.send(text), DEFAULT_TIME_RECONNECT)
    }
  }

  static sendObj(message) {
    if (!this.ws) return
    this.send(JSON.stringify(message))
  }

  static subscribe(channel) {
    if (!this.ws) return

    const message = JSON.stringify([messageTypes.SUBSCRIBE, WSTypePrefix + channel])
    this.WSListSubscribe.add(message)
    this.send(message)
  }
  static unsubscribe(channel) {
    if (!this.ws) return

    const message = JSON.stringify([messageTypes.UNSUBSCRIBE, WSTypePrefix + channel])
    this.WSListSubscribe.delete(message)
    this.send(message)
  }

  static async parseData(messageArray: Array<any>) {
    const [messageTypesData, channelDataSTR, data] = messageArray

    if (messageTypesData === messageTypes.EVENT) {
      const channelData = String(channelDataSTR).replace(WSTypePrefix, '')

      await store.dispatch(`${channelData}/setWSData`, data)
    }
  }
}

export default WSService
export { messageTypes }
