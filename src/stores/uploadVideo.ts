import { defineStore } from 'pinia'
import * as tus from 'tus-js-client'
import ApiService from '../services/api'
import store from '@/store'

type VideoStatus = 'updation' | 'transcoding' | 'available'

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
export const useVideoUploadStore = defineStore('videoUpload', () => {
  // const videoStatuses = useLocalStorage<string[]>('videoStatuses', [])

  const progress = ref(new Map<string, { state: boolean; percent: number }>())

  const getProgressState = (key: string): boolean | undefined => {
    return progress.value.get(key)?.state
  }

  const getProgressPercent = (key: string): number | undefined => {
    return progress.value.get(key)?.percent
  }

  function setProgressState(state: boolean, key: string) {
    if (state)
      progress.value.set(key, { state, percent: 0 })
    else
      progress.value.delete(key)
  }

  function setProgressPercent(percent: number, key: string) {
    progress.value.set(key, { state: true, percent })
  }

  async function getUploadUrl(payload: UploadVideoPayload): Promise<GetUploadURLResponse> {
    const { data }: { data: GetUploadURLResponse } = await ApiService.request({
      type: 'App.V2.Vimeo.UploadUrl',
      data: payload,
    })

    return data
  }

  async function upload(file: File, key: string) {
    const params = {
      title: file.name,
      description: file.name,
      fileSize: file.size,
      project: store.getters.selectedProject?.alias,
    }

    setProgressState(true, key)
    setProgressPercent(0, key)

    try {
      const uploadUrlData = await getUploadUrl(params)

      await uploadVideoToVimeo({
        file,
        uploadLink: uploadUrlData.uploadUrl,
        key,
      })

      const status = await getStatusVideo({ videoId: uploadUrlData.videoId })

      console.log({ status, videoId: uploadUrlData.videoId })

      return uploadUrlData.videoId
    }
    catch (e) {
      setProgressState(false, key)
    }
  }

  function uploadVideoToVimeo({ file, uploadLink, key }: UploadVideoToVimeoPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        uploadUrl: uploadLink,
        chunkSize: CHUNK_SIZE,
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: error => {
          setProgressState(false, key)
          reject(error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

          setProgressPercent(Number(percentage), key)
        },
        onSuccess: () => {
          setProgressPercent(100, key)
          setTimeout(() => {
            setProgressState(false, key)
          }, 200)
          resolve(upload.url!)
        },
      })

      upload.start()
    })
  }

  async function getStatusVideo(payload: GetStatusVideoPayload): Promise<string> {
    const { data }: { data: {
      status: VideoStatus
      duration: number
      thumbnail: string
      name: string
      embedUrl: string
      videoUrl: string
    } } = await ApiService.request({
      type: 'App.V2.Vimeo.Status',
      data: payload,
    })

    //
    // // Зберігаємо id відео, яке ще не доступне
    // if (data.status !== 'available' && !videoStatuses.value.includes(payload.videoId))
    //   videoStatuses.value.push(payload.videoId)
    // else if (data.status === 'available')
    //   videoStatuses.value = videoStatuses.value.filter(id => id !== payload.videoId)

    return data.status
  }

  // setInterval(async () => {
  //   await Promise.all(videoStatuses.value.map(videoId => {
  //     return getStatusVideo({ videoId })
  //   }))
  // }, 2000)

  return {
    progress,
    getProgressState,
    getProgressPercent,
    upload,

    // setProgressState,
    // setProgressPercent,
    // getUploadUrl,
    // uploadVideoToVimeo,
    // getStatusVideo,
  }
})
