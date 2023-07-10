export const getISOStringWithoutTimezone = (isoString) => {
    const utcStringWithoutTimezone = new Date(isoString).toUTCString().replace('GMT', '');
    return new Date(utcStringWithoutTimezone).toISOString();
};
export const getLocaleDateString = (date) => {
    return date.toLocaleDateString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const getLocaleDateStringWithoutTimezone = (isoString) => {
    const utcStringWithoutTimezone = new Date(isoString).toUTCString().replace('GMT', '');
    const date = new Date(utcStringWithoutTimezone);
    return getLocaleDateString(date);
};
export const getUTCISOString = (dateString) => {
    const localeDateString = getLocaleDateString(new Date(dateString));
    return transformDateToISO(localeDateString);
};
export const transformDateToISO = (dateString) => {
    const pattern = /(\d{2})\.(\d{2})\.(\d{4}),\s(\d{2}):(\d{2})/;
    const replaceValue = '$3-$2-$1-$4-$5';
    const [year, month, day, hour, minute] = dateString
        .trim()
        .replace(pattern, replaceValue)
        .split('-')
        .map((dateStringItem) => Number(dateStringItem));
    return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString();
};
export const convertDateToUTC = (date) => {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
};
//# sourceMappingURL=date.js.map