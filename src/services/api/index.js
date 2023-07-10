import axios from '../../libs/axios';
import { ContentType, Method, } from './config';
import store from '../../store';
import { v4 as uuidv4 } from 'uuid';
import useToastService from '../../helpers/toasts';
import router from '../../router';
import i18n from '../../libs/i18n';
import { convertCamelCase } from '../../helpers';
const { toastSuccess, toastError, toastErrorMessageString } = useToastService();
class ApiService {
    static async request(payload, config = {}) {
        const { method = Method.POST, contentType = ContentType.JSON, withErrorToast = true, withErrorDescriptionToast = false, withErrorNotFound = true, withSuccessToast = false, withLoader = true, formRef = null, newAxiosInstance = false, entityName = '', } = config;
        const convertedType = payload.type
            .replace('App', '/api')
            .split('.')
            .map((word) => convertCamelCase(word, '-'));
        const entity = entityName || convertedType[2];
        const url = convertedType.join('/');
        try {
            if (withLoader)
                store.dispatch('loaderOn', url);
            const axiosInstance = newAxiosInstance ? axios.create() : axios;
            const headers = {
                'Content-Type': contentType,
            };
            const body = contentType === ContentType.FormData && payload.formData
                ? this.createFormData(payload.formData)
                : JSON.stringify({
                    ...payload,
                    requestId: uuidv4(),
                });
            const { data } = await axiosInstance({
                url,
                method,
                headers,
                data: body,
            });
            if (data.error)
                throw data.error;
            if (withSuccessToast)
                toastSuccess(url);
            return data;
        }
        catch (error) {
            const isLoginPage = router.currentRoute.name === 'Login';
            const errorsType = ['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', 'TOKEN_INVALID'];
            if (store.getters['authCore/isAuthorizedUser'] && errorsType.includes(error.type)) {
                store.dispatch('authCore/clearAuth');
                if (!isLoginPage)
                    router.push({ name: 'Login' });
            }
            store.dispatch('addErrorUrl', url);
            const notVisibleErrorToast = !withErrorNotFound && error.type === 'NOT_FOUND';
            if (!notVisibleErrorToast) {
                if (withErrorToast)
                    this.showError(error, entity, formRef, withErrorDescriptionToast);
            }
            return Promise.reject(error);
        }
        finally {
            store.dispatch('loaderOff', url);
        }
    }
    static createFormData(data) {
        if (data instanceof FormData)
            return data;
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    }
    static showError(error, entity, formRef, withErrorDescriptionToast) {
        if (typeof error === 'string') {
            toastError(error);
            return;
        }
        if (error.validationErrors) {
            error.validationErrors.forEach(({ code, field }) => {
                const localizationKey = `${entity}_${field}_${code}`;
                formRef?.setErrors({
                    [field]: i18n.t(`validations.${localizationKey}`),
                });
                toastError(localizationKey, { field, defaultCode: 'field_ALREADY_EXISTS' });
            });
        }
        else if (withErrorDescriptionToast && error.description) {
            toastErrorMessageString(error.description);
        }
        else if (error.type) {
            toastError(error.type);
        }
        else if (error.isAxiosError) {
            toastError('axiosError');
        }
    }
}
export default ApiService;
export { Method, ContentType };
//# sourceMappingURL=index.js.map