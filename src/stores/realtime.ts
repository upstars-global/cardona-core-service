import { defineStore } from 'pinia'
import ApiService from '../services/api'
import { REALTIME_TOKEN_TYPE, RealtimeToken } from '../@model/realtime'

export const useRealtimeStore = defineStore('realtime', {
  actions: {
    /*
     * Through ApiService on purpose: the shared instance carries the session
     * interceptors, so the cookie, the one retry on a refusal and the
     * recorded refusal apply exactly as for any other request. Quiet, because
     * Centrifugo calls this in the background and retries on its own: a
     * loader or a toast per attempt would be noise the operator cannot act on.
     */
    async fetchConnectionToken(): Promise<RealtimeToken> {
      const { data } = await ApiService.request(
        { type: REALTIME_TOKEN_TYPE },
        { withLoader: false, withErrorToast: false },
      )

      return new RealtimeToken(data)
    },
  },
})
