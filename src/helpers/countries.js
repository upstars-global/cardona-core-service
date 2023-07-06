import { countries } from 'countries-list';
export default countries;
export const countriesSelect = Object.keys(countries).map((item) => {
    return {
        value: item,
        title: countries[item].name,
    };
});
export const allPhoneCodesWithFlags = Object.values(countries).map(({ phone, emoji }) => ({
    phone,
    flag: emoji,
}));
//# sourceMappingURL=countries.js.map