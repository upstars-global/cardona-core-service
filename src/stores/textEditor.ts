import { defineStore } from 'pinia'
import { omit } from 'lodash'

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
    setVariableTextBuffer(variableTextBuffer) {
      this.variableTextBuffer = variableTextBuffer
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
  },
})
