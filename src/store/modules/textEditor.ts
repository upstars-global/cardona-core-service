export default {
  namespaced: true,
  state: {
    isUpdateVar: false,
  },

  mutations: {
    SET_UPDATE_VAR(state, newIsUpdateVar) {
      state.isUpdateVar = newIsUpdateVar
    },
  },

  actions: {
    setUpdateVar({ commit }, newIsUpdateVar) {
      commit('SET_UPDATE_VAR', newIsUpdateVar)
    },
  },
}
