import { defineStore } from 'pinia'
import * as tus from 'tus-js-client'
import ApiService from '../services/api'
import store from '@/store'

export interface UploadVideoPayload {
  title: string
  description: string
  fileSize: number
  project: string
}

interface GetUploadURLResponse {
  internalId: number
  uploadUrl: string
  videoId: string
  videoUri: string
}

const CHUNK_SIZE = 1024 * 1024

const uploadVideoToVimeo = async (file: File, uploadLink: string) => {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: uploadLink,
      chunkSize: CHUNK_SIZE,
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError(error) {
        console.error('Upload failed:', error)
        reject(error)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        console.log(`Uploaded ${percentage}%`)
      },
      onSuccess() {
        console.log('Upload completed:', upload.url)
        resolve(upload.url)
      },
    })

    upload.start()
  })
}

export const useVideoUploadStore = defineStore('videoUpload', {
  actions: {
    async getUploadUrl(payload: UploadVideoPayload): Promise<GetUploadURLResponse> {
      const { data }: { data: GetUploadURLResponse } = await ApiService.request({
        type: 'App.V2.Vimeo.UploadUrl',
        data: payload,
      })

      return data
    },
    async upload(file: File) {
      const params = {
        title: file.name,
        description: file.name,
        fileSize: file.size,
        project: store.getters.selectedProject?.alias,
      }

      const uploadUrlData = await this.getUploadUrl(params)

      await uploadVideoToVimeo(file, uploadUrlData.uploadUrl)

      console.log(uploadUrlData)
    },
  },
})
