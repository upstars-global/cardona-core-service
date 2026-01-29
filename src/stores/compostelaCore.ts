import { defineStore } from 'pinia'
import ApiService, { ContentType } from '../services/api'
import { LoadFile } from '../@model/compostela'

export const useCompostelaStore = defineStore('compostelaCore', {
  state: () => ({}),

  actions: {
    async uploadFile(input: { path: string; file?: File; replace?: string }) {
      const formData = new FormData()

      formData.append('path', input.path)
      if (input.file)
        formData.append('file', input.file)

      if (input.replace)
        formData.append('replace', input.replace)

      const { data } = await ApiService.request(
        {
          type: 'App.V2.Upload.Compostela.Image.Create',
          formData,
        },
        {
          contentType: ContentType.FormData,
        },
      )

      return new LoadFile(data)
    },

    async getImagesList(payload: { pageNumber: number; perPage: number; search: string }) {
      const data = await ApiService.request({
        type: 'App.V2.Compostela.Images.List',
        pagination: {
          pageNumber: payload.pageNumber,
          perPage: payload.perPage,
        },
        filter: {
          path: payload.search,
        },
      })

      data.data = data.data.map(item => ({
        ...item,
        publicPath: item.publicPath || item.filename,
      }))

      return data
    },

    async getStructureList(payload: {
      path: string
      pageNumber: number
      perPage: number
      search: string
    }) {
      if (payload.search) {
        return this.getImagesList({
          pageNumber: payload.pageNumber,
          perPage: payload.perPage,
          search: payload.search,
        })
      }

      return await ApiService.request({
        type: 'App.V2.Compostela.Structure.List',
        pagination: {
          pageNumber: payload.pageNumber,
          perPage: payload.perPage,
        },
        filter: {
          path: payload.path,
        },
      })
    },
  },
})
