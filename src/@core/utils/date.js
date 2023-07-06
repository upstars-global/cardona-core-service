export const dateFormat = (date, options) => {
    return date.toLocaleDateString(navigator.language, { ...options, timeZone: 'UTC' });
};
export const dayDate = (date) => {
    return dateFormat(date);
};
export const fullDate = (date) => {
    return dateFormat(date, { hour: '2-digit', minute: '2-digit' });
};
export const fullDateWithSeconds = (date) => {
    return dateFormat(date, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
//# sourceMappingURL=date.js.map