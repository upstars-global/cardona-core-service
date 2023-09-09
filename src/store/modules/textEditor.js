import { omit } from 'lodash';
export default {
    namespaced: true,
    state: {
        isUpdateVar: false,
        variableTextBuffer: {},
    },
    mutations: {
        SET_UPDATE_VAR(state, newIsUpdateVar) {
            state.isUpdateVar = newIsUpdateVar;
        },
        SET_VARIABLE_TEXT_BUFFER(state, variableTextBuffer) {
            state.variableTextBuffer = variableTextBuffer;
        },
        SET_VARIABLE_BY_KEY(state, { key, value }) {
            state.variableTextBuffer[key] = value;
        },
        REMOVE_VARIABLE_VALUE_BY_KEY(state, key) {
            state.variableTextBuffer = omit(state.variableTextBuffer, [key]);
        },
    },
    actions: {
        setUpdateVar({ commit }, newIsUpdateVar) {
            commit('SET_UPDATE_VAR', newIsUpdateVar);
        },
        setVariableTextBuffer({ commit }, variableTextBuffer) {
            commit('SET_VARIABLE_TEXT_BUFFER', variableTextBuffer);
        },
        setVariableByKey({ commit }, variableTextBuffer) {
            commit('SET_VARIABLE_BY_KEY', variableTextBuffer);
        },
        removeVariableValueByKey({ commit }, key) {
            commit('REMOVE_VARIABLE_VALUE_BY_KEY', key);
        },
    },
};
//# sourceMappingURL=textEditor.js.map