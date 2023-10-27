import type { ModalKeys } from '@/@model/enums/modals'

export default {
  namespaced: true,
  state: {
    fullImage: false,
  },
  getters: {
    getState: state => key => {
      return state[key]
    },
  },
  mutations: {
    ON_TOGGLE_MODAL_STATE(state, modalKey) {
      state[modalKey] = !state[modalKey]
    },
    ON_SET_MODAL_STATE(state, { modalKey, data }) {
      state[modalKey] = data
    },
  },
  actions: {
    toggleModal({ commit }, modalKey: ModalKeys) {
      commit('ON_TOGGLE_MODAL_STATE', modalKey)
    },

    setModalState({ commit }, { modalKey, data = false }) {
      commit('ON_SET_MODAL_STATE', { modalKey, data })
    },
  },
}
