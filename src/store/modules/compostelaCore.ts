import ApiService, { ContentType } from '../../services/api'
import { LoadFile } from '../../@model/compostela'

export default {
  namespaced: true,
  state: {},

  actions: {
    async uploadFile({ commit }, input) {
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

    async getImagesList(
      { commit },
      { pageNumber, perPage, search }: { pageNumber: number; perPage: number; search: string },
    ) {
      const data = await ApiService.request({
        type: 'App.V2.Compostela.Images.List',
        pagination: {
          pageNumber,
          perPage,
        },
        filter: {
          path: search,
        },
      })

      data.data = data.data.map(item => {
        return {
          ...item,
          publicPath: item.publicPath ? item.publicPath : item.filename,
        }
      })

      return data
    },

    async getStructureList(
      { commit, dispatch },
      {
        path,
        pageNumber,
        perPage,
        search,
      }: { path: string; pageNumber: number; perPage: number; search: string },
    ) {
      if (search)
        return dispatch('getImagesList', { pageNumber, perPage, search })

      return await ApiService.request({
        type: 'App.V2.Compostela.Structure.List',
        pagination: {
          pageNumber,
          perPage,
        },
        filter: {
          path,
        },
      })
    },
  },
}
