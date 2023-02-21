import ApiService from '@/services/api'
import { ListData } from '@/@model'
import { IRequestListPayload } from '@model/index'
import { ExportFormat, IOptionsBaseFetch } from '@/components/templates/BaseList/model'
import { convertLowerCaseFirstSymbol } from '@/helpers'

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

    SET_APPLIED_FILTERS(state, filters) {
      state.appliedFilters = filters
    },
  },

  actions: {
    async fetchListEntity(
      { commit, rootGetters },
      payload: { type: string; data: IRequestListPayload; options: IOptionsBaseFetch }
    ) {
      const fetchData = new ListData(
        await ApiService.request({
          type: 'App.V2.' + transformNameToType(payload.type) + '.List',
          pagination: {
            pageNumber: payload.data?.page || 1,
            perPage: payload.data?.perPage || 10,
          },
          sort: payload.data?.sort,
          filter: {
            ...payload.data?.filter,
            project: rootGetters.selectedProject.alias,
          },
        })
      )

      if (payload.options.saveCountItem) {
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
        type: 'App.V2.' + transformNameToType(type) + '.List.Report',
        sort: data?.sort,
        pagination: {
          pageNumber: data?.page || 1,
          perPage: data?.perPage,
        },
        filter: {
          ...data?.filter,
          project: rootGetters.selectedProject.alias,
        },
      })

      return data.filter.format === ExportFormat.JSON ? JSON.stringify(response) : response
    },

    async readEntity({ rootGetters }, payload: { type: string; id: string }) {
      const { data } = await ApiService.request({
        type: 'App.V2.' + transformNameToType(payload.type) + '.Read',
        data: {
          id: payload.id,
          project: rootGetters.selectedProject.alias,
        },
      })

      return data
    },

    async fetchTypes({ rootGetters }, type: string) {
      return await ApiService.request({
        type: 'App.V2.' + transformNameToType(type) + '.Types.List',
        data: {
          project: rootGetters.selectedProject.alias,
        },
      })
    },

    async deleteEntity({ rootGetters }, payload: { type: string; id: string; comment: string }) {
      return await ApiService.request(
        {
          type: 'App.V2.' + transformNameToType(payload.type) + '.Delete',
          data: {
            id: payload.id,
            comment: payload.comment,
            project: rootGetters.selectedProject.alias,
          },
        },
        { withSuccessToast: true }
      )
    },

    async updateEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any } }
    ) {
      return await ApiService.request(
        {
          type: 'App.V2.' + transformNameToType(payload.type) + '.Update',
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: rootGetters.selectedProject.alias,
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
          type: 'App.V2.' + transformNameToType(type) + '.Update.Multiple',
          data: {
            project: rootGetters.selectedProject.alias,
            [entityKey]: data,
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
          type: 'App.V2.' + transformNameToType(type) + '.Delete.Multiple',
          data: {
            ids,
            project: rootGetters.selectedProject.alias,
          },
        },
        { withSuccessToast: true }
      )
    },

    async createEntity(
      { rootGetters },
      payload: { type: string; data: { form: any; formRef: any } }
    ) {
      const { data } = await ApiService.request(
        {
          type: 'App.V2.' + transformNameToType(payload.type) + '.Create',
          data: {
            ...payload.data.form,
            id: payload.data.form?.id,
            project: rootGetters.selectedProject.alias,
          },
        },
        { withSuccessToast: true, formRef: payload.data.formRef }
      )

      return data
    },
  },
}
