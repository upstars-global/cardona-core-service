import Vue from 'vue';
import axios from 'axios';
import store from '../store';
import { applyAuthTokenInterceptor } from 'axios-jwt';
const requestRefresh = async (refreshToken) => await store.dispatch('authCore/refreshAuth', refreshToken);
applyAuthTokenInterceptor(axios, { requestRefresh });
const axiosIns = axios.create({
// You can add your headers here
// ================================
// baseURL: 'https://some-domain.com/api/',
// timeout: 1000,
// headers: {'X-Custom-Header': 'foobar'}
});
Vue.prototype.$http = axiosIns;
export default axios;
//# sourceMappingURL=axios.js.map