import ApiService from '../../services/api'
import { ListData } from '../../@model'
import { IRequestListPayload } from '../../@model/index'
import { ExportFormat, IOptionsBaseFetch } from '../../components/templates/BaseList/model'
import {
  GamesSectionGamesItem,
  IGamesSectionGamesFilters,
  IGamesSectionGamesListPayload,
} from '../../@model/games'
import { convertLowerCaseFirstSymbol } from '../../helpers'
import { ApiTypeService } from '@productConfig'

const transformNameToType = (type: string): string => {
  return [...type]
    .map((item, index) => {
      if (index === 0) {
        return item.toUpperCase()
      } else if (item.toUpperCase() === item) {
        return '.' + item
      } else {
        return item
      }
    })
    .join('')
}

export default {
  namespaced: true,
  state: {
    totalItem: 0,
    appliedFilters: {},
  },

  getters: {
    totalItem: ({ totalItem }) => totalItem,
    appliedFilters: ({ appliedFilters }) => appliedFilters,
  },

  mutations: {
    SET_TOTAL(state, total: number) {
      state.totalItem = total
    },

    SET_APPLIED_FILTERS(state, filters: IGamesSectionGamesFilters) {
      state.appliedFilters = filters
    },
  },

  actions: {
    async fetchGamesList(
      { rootGetters, commit },
      { type, data }: { type: string; data: IGamesSectionGamesListPayload }
    ) {
      return new ListData<GamesSectionGamesItem>(
        await ApiService.request({
          type: ApiTypeService + transformNameToType(type) + '.Games.List',
          pagination: {
            pageNumber: data?.page || 1,
            perPage: data?.perPage,
          },
          sort: data?.sort,
          filter: {
            ...data?.filter,
            project: rootGetters.selectedProject?.alias,
          },
        })
      )
    },

    async fetchListEntity(
      { commit, rootGetters },
      payload: { type: string; data: IRequestListPayload; options: IOptionsBaseFetch }
    ) {
      const { saveCountItem, listItemModel } = payload.options
      const fetchData = new ListData(
        await ApiService.request({
          type: ApiTypeService + transformNameToType(payload.type) + '.List',
          pagination: {
            pageNumber: payload.data?.page || 1,
            perPage: payload.data?.perPage || 10,
          },
          sort: payload.data?.sort,
          filter: {
            ...payload.data?.filter,
            project: rootGetters.selectedProject?.alias,
          },
        }),
        listItemModel
      )

      if (saveCountItem) {
        commit('SET_TOTAL', fetchData.total)
        commit('SET_APPLIED_FILTERS', payload.data?.filter)
      }
      return fetchData
    },

    async fetchReport(
      { rootGetters },
      { type, data }: { type: string; data: IRequestListPayload }
    ) {
      const response = await ApiService.request({
        type: ApiTypeService + transformNameToType(type) + '.List.Report',
        sort: data?.sort,
        pagination: {
          pageNumber: data?.page || 1,
          perPage: data?.perPage,
        },
        filter: {
          ...data?.filter,
          project: rootGetters.selectedProject?.alias,
        },
      })

      return data.filter.format === ExportFormat.JSON ? JSON.stringify(response) : response
    },

    async readEntity({ rootGetters }, payload: { type: string; id: string }) {
      const { data } = await ApiService.request({
        type: ApiTypeService + transformNameToType(payload.type) + '.Read',
        data: {
          id: payload.id,
          project: rootGetters.selectedProject?.alias,
        },
      })

      return data
    },

    async fetchTypes({ rootGetters }, type: string) {
      return await ApiService.request({
        type: ApiTypeService + transformNameToType(type) + '.Types.List',
        data: {
          project: rootGetters.selectedProject?.alias,
        },
      })
    },

    async createEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any } }
    ) {
      const { data } = await ApiService.request(
        {
          type: ApiTypeService + transformNameToType(payload.type) + '.Create',
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: rootGetters.selectedProject?.alias,
            productId: rootGetters['productCore/productId'],
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef }
      )

      return data
    },

    async updateEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any } }
    ) {
      return await ApiService.request(
        {
          type: ApiTypeService + transformNameToType(payload.type) + '.Update',
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            productId: rootGetters['productCore/productId'],
            project: rootGetters.selectedProject?.alias,
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef }
      )
    },

    async multipleUpdateEntity(
      { rootGetters },
      { type, data }: { type: string; data: Array<{ id: string; isActive: boolean }> }
    ) {
      const entityKey: string = convertLowerCaseFirstSymbol(type)

      return await ApiService.request(
        {
          type: ApiTypeService + transformNameToType(type) + '.Update.Multiple',
          data: {
            project: rootGetters.selectedProject?.alias,
            [entityKey]: data,
          },
        },
        { withSuccessToast: true }
      )
    },

    async deleteEntity({ rootGetters }, payload: { type: string; id: string; comment: string }) {
      return await ApiService.request(
        {
          type: ApiTypeService + transformNameToType(payload.type) + '.Delete',
          data: {
            id: payload.id,
            comment: payload.comment,
            project: rootGetters.selectedProject?.alias,
          },
        },
        { withSuccessToast: true }
      )
    },

    async multipleDeleteEntity(
      { rootGetters },
      { type, ids }: { type: string; ids: Array<string> }
    ) {
      return await ApiService.request(
        {
          type: ApiTypeService + transformNameToType(type) + '.Delete.Multiple',
          data: {
            ids,
            project: rootGetters.selectedProject?.alias,
          },
        },
        { withSuccessToast: true }
      )
    },
  },
}
