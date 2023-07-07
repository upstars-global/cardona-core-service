import { FieldInfo, FieldType } from './field';
import i18n from '../libs/i18n';
import { tagsList } from '../@fake-db/data/demo';
export var ProjectFilterTypes;
(function (ProjectFilterTypes) {
    ProjectFilterTypes["Tags"] = "tags";
})(ProjectFilterTypes || (ProjectFilterTypes = {}));
const tags = new FieldInfo({
    type: FieldType.MultiSelect,
    key: ProjectFilterTypes.Tags,
    label: i18n.t('common.tags'),
    placeholder: i18n.t('placeholder.filter.tags'),
    options: tagsList,
});
export default {
    tags,
};
//# sourceMappingURL=filterConfig.js.map