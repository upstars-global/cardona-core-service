import { FieldInfo, FieldType } from '../@model/field';
import i18n from '../libs/i18n';
export class StaticPagesForm {
    id;
    name;
    buttonName;
    slug;
    isActive;
    isHidden;
    position;
    imagePath;
    localisationParameters;
    seo;
    games;
    fieldTranslations;
    constructor(data) {
        this.id = data?.id;
        this.isActive = data?.isActive || false;
        this.name = new FieldInfo({
            type: FieldType.Text,
            key: 'name',
            value: data?.name || '',
            label: String(i18n.t('common.staticPages.name')),
            validationRules: 'required',
            isLocalization: true,
        });
        this.buttonName = new FieldInfo({
            type: FieldType.Text,
            key: 'buttonName',
            value: data?.buttonName || '',
            label: String(i18n.t('common.staticPages.buttonName')),
            isLocalization: true,
        });
        this.isHidden = new FieldInfo({
            type: FieldType.Check,
            key: 'isHidden',
            value: data?.isHidden || false,
            label: String(i18n.t('common.staticPages.isHidden')),
            description: String(i18n.t('common.staticPages.isHiddenDescription')),
        });
        this.slug = new FieldInfo({
            type: FieldType.Text,
            key: 'slug',
            value: data?.slug || '',
            label: String(i18n.t('common.slug')),
            validationRules: 'required',
        });
        this.position = new FieldInfo({
            type: FieldType.Number,
            key: 'position',
            value: data?.position || 1,
            label: String(i18n.t('common.order')),
            validationRules: 'required',
        });
        this.seo = data?.seo;
        this.games = data?.games;
        this.localisationParameters = data?.localisationParameters || {};
        this.fieldTranslations = data?.fieldTranslations || {};
    }
}
export class StaticPagesFilters {
    search;
    isHidden;
    isActive;
    createdFrom;
    createdTo;
    updatedFrom;
    updatedTo;
    constructor({ search, isHidden, isActive, createdFrom, createdTo, updatedFrom, updatedTo, }) {
        this.search = search;
        this.isHidden = isHidden;
        this.isActive = isActive;
        this.createdFrom = createdFrom;
        this.createdTo = createdTo;
        this.updatedFrom = updatedFrom;
        this.updatedTo = updatedTo;
    }
}
//# sourceMappingURL=staticPages.js.map