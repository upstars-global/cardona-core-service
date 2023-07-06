import i18n from '../libs/i18n';
import { TextBaseField, NumberBaseField } from '../@model/baseField';
export class GamesCategoriesForm {
    id;
    name;
    slug;
    path;
    isActive;
    position;
    imagePath;
    localisationParameters;
    seo;
    games;
    fieldTranslations;
    constructor(data) {
        this.id = data?.id;
        this.isActive = data?.isActive || false;
        this.name = new TextBaseField({
            key: 'name',
            value: data?.name,
            label: i18n.t('common.category.name'),
            validationRules: 'required',
            isLocalization: true,
        });
        this.slug = new TextBaseField({
            key: 'slug',
            value: data?.slug,
            label: i18n.t('common.slug'),
            validationRules: 'required',
        });
        this.path = new TextBaseField({
            key: 'path',
            value: data?.path,
            label: i18n.t('common.category.url'),
        });
        this.position = new NumberBaseField({
            key: 'position',
            value: data?.position || 1,
            label: i18n.t('common.order'),
        });
        this.imagePath = data?.imagePath || '';
        this.seo = data?.seo;
        this.games = data?.games;
        this.localisationParameters = data?.localisationParameters || {};
        this.fieldTranslations = data?.fieldTranslations || {};
    }
}
export class GamesCategoriesFilters {
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
//# sourceMappingURL=gamesCategories.js.map