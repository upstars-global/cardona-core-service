import { defineStore } from 'pinia'
import ApiService from '../services/api'

export interface UploadVideoPayload {
  fileSize: number
  title: string
  description: string
  project: string
}
export const useVideoUploadStore = defineStore('videoUpload', {
  actions: {
    async upload(payload: UploadVideoPayload) {
      const { data } = await ApiService.request({
        type: 'App.V2.Vimeo.UploadUrl',
        data: payload,
      })

      console.log(data)
    },
  },
})
