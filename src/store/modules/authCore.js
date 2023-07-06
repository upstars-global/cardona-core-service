import ApiService from '../../services/api';
import { isLoggedIn, setAuthTokens, clearAuthTokens } from 'axios-jwt';
export default {
    namespaced: true,
    state: {
        isAuthorized: isLoggedIn(),
    },
    getters: {
        isAuthorizedUser: ({ isAuthorized }) => isAuthorized,
    },
    mutations: {
        SET_AUTH(state, payload) {
            state.isAuthorized = payload;
        },
    },
    actions: {
        async login({ commit, dispatch }, authData) {
            const { data } = await ApiService.request({
                type: 'App.V2.Auth',
                data: authData,
            });
            setAuthTokens(data);
            commit('SET_AUTH', true);
            await dispatch('fetchCurrentUser', {}, { root: true });
        },
        async refreshAuth(context, refreshToken) {
            const { data } = await ApiService.request({
                type: 'App.V2.Auth.Refresh',
                data: {
                    refreshToken,
                },
            }, { newAxiosInstance: true });
            return data;
        },
        clearAuth({ commit }) {
            clearAuthTokens();
            commit('SET_AUTH', false);
        },
    },
};
//# sourceMappingURL=authCore.js.map