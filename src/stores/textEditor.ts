import { defineStore } from 'pinia'
import { omit } from 'lodash'
import type { OptionsItem } from '../@model'
import { ListData } from '../@model'
import { convertDictionaryToOptions } from '../helpers'
import i18n from '../plugins/i18n'
import ApiService from '../services/api'

export class GiftOptionsType implements OptionsItem {
  readonly id: string
  readonly name: string

  constructor(data: OptionsItem) {
    this.id = data.name
    this.name = i18n.t(`common.giftTypes.${data.name}`)
  }
}
export class GiftOptionsItem {
  readonly id: string
  readonly name: string

  constructor(data: OptionsItem) {
    this.id = data.name
    this.name = data.name
  }
}

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
    async fetchGiftsTypeList() {
      const { data: responseData }: { data: Record<string, string> } = await ApiService.request({
        type: 'App.V2.Gifts.Types.List',
        data: {
          project: this.$selectedProjectAlias,
        },
      })

      const data: Array<OptionsItem> = convertDictionaryToOptions(responseData)

      return new ListData<OptionsItem>({ data }, GiftOptionsType)
    },
    async fetchGifts(parmas?: { pageNumber?: number; perPage?: number; filter?: Record<string, any> }) {
      return new ListData<string>(
        await ApiService.request({
          type: 'App.V2.Gifts.List',
          data: {
            project: this.$selectedProjectAlias,
          },
          pagination: {
            pageNumber: parmas?.pageNumber || 1,
            perPage: parmas?.perPage || 50,
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
