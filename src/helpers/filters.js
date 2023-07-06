import i18n from '../libs/i18n';
import { getLocaleDateString, transformDateToISO } from '../helpers/date';
export const formatPhone = (phone) => {
    const mask = '1 111 111 11 11';
    let phoneArr = String(Number(phone)).trim().split('');
    let i = 0;
    phoneArr = phoneArr.map((item) => {
        if (mask[i] === '1') {
            i++;
            return item;
        }
        else {
            i += 2;
            return ' ' + item;
        }
    });
    return '+' + phoneArr.join('');
};
export const parseDateRange = (dateFilter) => {
    const dateSeparators = {
        en: 'to',
        ru: '—',
    };
    return dateFilter.split(dateSeparators[i18n.locale]).map(transformDateToISO);
};
export const parseInputDateRange = (from, to) => {
    const dateSeparators = {
        en: 'to',
        ru: '—',
    };
    return `${getLocaleDateString(from)} ${dateSeparators[i18n.locale]} ${getLocaleDateString(to)}`;
};
//# sourceMappingURL=filters.js.map