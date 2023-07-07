import { FieldInfo, FieldType } from '../@model/field';
import i18n from '../libs/i18n';
export class SeoForm {
    metaTitle;
    metaDescription;
    description;
    constructor(data) {
        this.metaTitle = new FieldInfo({
            type: FieldType.Text,
            key: 'metaTitle',
            value: data?.metaTitle || '',
            label: String(i18n.t('seo.metaTitle')),
            isLocalization: true,
        });
        this.metaDescription = new FieldInfo({
            type: FieldType.Textarea,
            key: 'metaDescription',
            value: data?.metaDescription || '',
            label: String(i18n.t('seo.metaDescription')),
            isLocalization: true,
        });
        this.description = new FieldInfo({
            type: FieldType.RichText,
            key: 'description',
            value: data?.description || '',
            label: String(i18n.t('seo.description')),
            form: null,
            isLocalization: true,
        });
    }
}
//# sourceMappingURL=seo.js.map