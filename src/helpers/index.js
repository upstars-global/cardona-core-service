import { useRouter } from '../@core/utils/utils';
import { FieldInfo } from '../@model/field';
import { BaseField } from '../@model/baseField';
import { isObject } from '../@core/utils/utils';
export const isNullOrUndefinedValue = (value) => value === null || value === undefined;
export const transformFormData = (form) => {
    return Object.entries(form).reduce((acc, [key, valueData]) => {
        if (valueData instanceof BaseField) {
            acc[key] = valueData.transformField();
        }
        else if (valueData instanceof FieldInfo) {
            // TODO: Delete after migration to BaseField
            acc[key] = Array.isArray(valueData.value)
                ? valueData.value.map((item) => item.id || item)
                : valueData.value?.id ?? valueData.value ?? '';
        }
        else if (Array.isArray(valueData) && typeof valueData[0] !== 'string') {
            acc[key] = valueData
                .map((item) => (item instanceof FieldInfo ? item.value : transformFormData(item)))
                .filter((item) => !!item);
        }
        else if (isObject(valueData)) {
            const valueDataInner = JSON.parse(JSON.stringify(valueData));
            Object.keys(valueData).forEach((keyInner) => {
                if (valueData[keyInner] instanceof FieldInfo) {
                    valueDataInner[keyInner] = Array.isArray(valueData[keyInner].value)
                        ? valueData[keyInner].value.map((item) => item.id || item)
                        : valueData[keyInner].value?.id ?? valueData[keyInner].value ?? '';
                }
                else {
                    valueDataInner[keyInner] = valueData[keyInner];
                }
            });
            acc[key] = valueDataInner;
        }
        else {
            acc[key] = valueData;
        }
        return acc;
    }, {});
};
export const convertCamelCase = (string, separator) => string[0].toLowerCase() +
    string.slice(1).replace(/[A-Z]/g, (letter) => `${separator}${letter.toLowerCase()}`);
export const convertLowerCaseFirstSymbol = (string) => string[0].toLowerCase() + string.slice(1);
export const convertUpperCaseFirstSymbol = (word) => word[0].toUpperCase() + word.slice(1);
export const checkExistsPage = (pageName) => {
    const { router } = useRouter();
    const { route } = router.resolve({ name: pageName });
    return route.matched.isNotEmpty;
};
export const convertDictionaryToOptions = (dictionary) => {
    return Object.entries(dictionary).map(([id, name]) => ({
        id,
        name,
    }));
};
const formatPermissionResponse = (basePermission) => {
    return {
        permissionKey: basePermission,
        permissionKeySeo: basePermission + '-seo',
        permissionKeyReport: basePermission + '-report',
    };
};
export const getPermissionKeys = (config) => {
    const { entityNamePermission } = config;
    let { permissionKey = '', permissionPrefix = '' } = config;
    if (!permissionKey && !entityNamePermission) {
        throw new Error('No permission detected');
    }
    if (permissionPrefix) {
        permissionPrefix += '-';
    }
    if (!permissionKey && entityNamePermission) {
        permissionKey = convertCamelCase(entityNamePermission, '-');
    }
    return formatPermissionResponse(permissionPrefix + permissionKey);
};
//# sourceMappingURL=index.js.map