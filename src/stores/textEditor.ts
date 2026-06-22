import { defineStore } from 'pinia'
import { omit } from 'lodash'
import { ListData } from '../@model'
import ApiService from '../services/api'
import { OPTIONS_PER_PAGE } from '../utils/constants'
import { GiftOptionsItem } from '../@model/gift'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => ({
    isSave: false,
    isUpdateVar: false,
    variableTextBuffer: {},
  }),

  actions: {
    setUpdateVar(newIsUpdateVar) {
      this.isUpdateVar = newIsUpdateVar
    },
    setSave(newIsSave) {
      this.isSave = newIsSave
    },
    setVariableTextBuffer(variableTextBuffer) {
      this.variableTextBuffer = variableTextBuffer || {}
    },
    setVariableByKey({ key, value }) {
      this.variableTextBuffer = {
        ...this.variableTextBuffer,
        [key]: value,
      }
    },
    removeVariableValueByKey(key) {
      this.variableTextBuffer = omit(this.variableTextBuffer, [key])
    },
    async readGiftEntity(id: string) {
      const { data } = await ApiService.request({
        type: 'App.V2.Gifts.Read',
        data: {
          id,
          project: this.$selectedProjectAlias,
        },
      })

      return data
    },
    async fetchGiftsOptions(parmas?: { pageNumber?: number; perPage?: number; filter?: Record<string, any> }) {
      return new ListData<string>(
        await ApiService.request({
          type: 'App.V2.Gifts.List',
          data: {
            project: this.$selectedProjectAlias,
          },
          pagination: {
            pageNumber: parmas?.pageNumber || 1,
            perPage: parmas?.perPage || OPTIONS_PER_PAGE,
          },
          filter: {
            ...(parmas?.filter || {}),
            project: this.$selectedProjectAlias,
          },
        }),
        GiftOptionsItem,
      )
    },
    async fetchGiftSpinOffersOptions(parmas?: { pageNumber?: number; perPage?: number; filter?: Record<string, any> }) {
      return new ListData<string>(
        await ApiService.request({
          type: 'App.V2.Alaro.GiftSpin.Templates.List',
          data: {
            project: this.$selectedProjectAlias,
          },
          pagination: {
            pageNumber: parmas?.pageNumber || 1,
            perPage: parmas?.perPage || OPTIONS_PER_PAGE,
          },
          filter: {
            ...(parmas?.filter || {}),
            project: this.$selectedProjectAlias,
          },
        }),
        GiftOptionsItem,
      )
    },
  },
})
