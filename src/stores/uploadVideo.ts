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

interface UploadVideoToVimeoPayload {
  file: File
  uploadLink: string
  key: string
}

interface GetStatusVideoPayload {
  videoId: string
  project: string
}

const CHUNK_SIZE = 1024 * 1024

export const useVideoUploadStore = defineStore('videoUpload', {
  state: () => ({
    progress: new Map<string, { state: boolean; percent: number }>(),
  }),
  getters: {
    getProgressState: state => (key: string): Map<string, { state: boolean; percent: number }> => state.progress.get(key)?.state,
    getProgressPercent: state => (key: string): number => state.progress.get(key)?.percent,
  },
  actions: {
    setProgressState(state: boolean, key: string) {
      if (state)
        this.progress.set(key, { state, percent: 0 })
      else this.progress.delete(key)
    },
    setProgressPercent(progress: number, key: string) {
      this.progress.set(key, { state: true, percent: progress })
    },
    async getUploadUrl(payload: UploadVideoPayload): Promise<GetUploadURLResponse> {
      const { data }: { data: GetUploadURLResponse } = await ApiService.request({
        type: 'App.V2.Vimeo.UploadUrl',
        data: payload,
      })

      return data
    },
    async upload(file: File, key: string) {
      const params = {
        title: file.name,
        description: file.name,
        fileSize: file.size,
        project: store.getters.selectedProject?.alias,
      }

      this.setProgressState(true, key)
      this.setProgressPercent(0, key)

      try {
        const uploadUrlData = await this.getUploadUrl(params)

        await this.uploadVideoToVimeo({
          file,
          uploadLink: uploadUrlData.uploadUrl,
          key,
        })

        return uploadUrlData.videoId
      }
      catch {
        this.setProgressState(false, key)
      }
    },
    async uploadVideoToVimeo({ file, uploadLink, key }: UploadVideoToVimeoPayload) {
      return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          uploadUrl: uploadLink,
          chunkSize: CHUNK_SIZE,
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          onError: error => {
            this.setProgressState(false, key)
            reject(error)
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

            this.setProgressPercent(Number(percentage), key)
          },
          onSuccess: () => {
            this.setProgressPercent(100, key)
            setTimeout(() => {
              this.setProgressState(false, key)
            }, 200)
            resolve(upload.url)
          },
        })

        upload.start()
      })
    },
    async getStatusVideo(payload: GetStatusVideoPayload): Promise<string> {
      const { data }: { data: {
        status: string
        duration: number
        thumbnail: string
        name: string
        embedUrl: string
        videoUrl: string
      } } = await ApiService.request({
        type: 'App.V2.Vimeo.Status',
        data: payload,
      })

      console.log(data.status)

      return data.status
    },
  },
})
