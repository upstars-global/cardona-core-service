import { FieldInfo, FieldType } from '../@model/field';
import i18n from '../libs/i18n';
import store from '../store';
// List
export class GamesProducersForm {
    id;
    name;
    slug;
    path;
    isActive;
    position;
    imagePath;
    localisationParameters;
    availableDomains;
    seo;
    isNew;
    currencies;
    games;
    fieldTranslations;
    restrictedCountries;
    constructor(data) {
        this.id = data?.id;
        this.isActive = data?.isActive || false;
        this.currencies = new FieldInfo({
            type: FieldType.CheckGroup,
            key: 'currencies',
            value: data?.currencies || [],
            options: store.getters['appConfigCore/allCurrencies'].map((item) => ({ id: item, name: item })),
            label: String(i18n.t('common.producers.currencies.label')),
            description: String(i18n.t('common.producers.currencies.description')),
        });
        this.isNew = new FieldInfo({
            type: FieldType.Check,
            key: 'isNew',
            value: data?.isNew,
            label: String(i18n.t('common.producers.isNew')),
        });
        this.name = new FieldInfo({
            type: FieldType.Text,
            key: 'name',
            value: data?.name || '',
            label: String(i18n.t('common.producers.name')),
            validationRules: 'required',
        });
        this.slug = new FieldInfo({
            type: FieldType.Text,
            key: 'slug',
            value: data?.slug || '',
            label: String(i18n.t('common.slug')),
            validationRules: 'required',
        });
        this.path = new FieldInfo({
            type: FieldType.Text,
            key: 'path',
            value: data?.path || '',
            label: String(i18n.t('common.producers.url')),
            validationRules: 'required',
        });
        this.position = new FieldInfo({
            type: FieldType.Number,
            key: 'position',
            value: data?.position || 1,
            label: String(i18n.t('common.order')),
        });
        this.imagePath = data?.imagePath || '';
        this.seo = data?.seo;
        this.games = data?.games;
        this.localisationParameters = data?.localisationParameters || {};
        this.fieldTranslations = data?.fieldTranslations || {};
        this.restrictedCountries = data?.restrictedCountries || [];
        this.availableDomains = data?.availableDomains.isNotEmpty
            ? data.availableDomains.map((domain) => createDomainFieldItem(domain))
            : [createDomainFieldItem()];
    }
}
const createDomainFieldItem = (domain) => new FieldInfo({
    type: FieldType.Text,
    value: domain,
    key: 'domain',
    label: String(i18n.t('page.games.allowedDomains')),
    placeholder: String(i18n.t('page.games.allowedDomainsPlaceholder')),
    info: String(i18n.t('page.games.allowedDomainsInfo')),
});
export class GamesProducersFilters {
    search;
    name;
    slug;
    isActive;
    createdFrom;
    createdTo;
    updatedFrom;
    updatedTo;
    constructor({ search, name, slug, isActive, createdFrom, createdTo, updatedFrom, updatedTo, }) {
        this.search = search;
        this.name = name;
        this.slug = slug;
        this.isActive = isActive;
        this.createdFrom = createdFrom;
        this.createdTo = createdTo;
        this.updatedFrom = updatedFrom;
        this.updatedTo = updatedTo;
    }
}
//# sourceMappingURL=gamesProducers.js.map