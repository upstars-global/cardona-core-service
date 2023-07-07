import { UserSmallInfo } from '../@model/user';
import { ViewInfo, ViewType } from '../@model/view';
import i18n from '../libs/i18n';
import { FieldInfo, FieldType } from '../@model/field';
import store from '../store';
export class GroupData {
    id;
    name;
    users;
    permissions;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.users = data.users.map((user) => new UserSmallInfo(user));
        this.permissions = data.permissions;
    }
}
export class GroupsFilters {
    search;
    constructor({ search }) {
        this.search = search;
    }
}
export class GroupsSideBarFields {
    id;
    name;
    users;
    constructor(data) {
        this.name = new ViewInfo({
            type: ViewType.Text,
            value: data?.name,
            label: i18n.t('common.groups._'),
        });
        this.id = new ViewInfo({
            type: ViewType.BadgeCopy,
            value: data?.id,
            label: i18n.t('page.groupList.groupID'),
        });
        this.users = new ViewInfo({
            type: ViewType.Badges,
            value: data?.users,
            withSearch: true,
            label: i18n.t('common.admin.fullListCount', { count: data?.users?.length }),
        });
    }
}
//Form
export class GroupForm {
    id;
    name;
    userIds;
    productId;
    permissions;
    constructor(data) {
        const users = data?.users.map((user) => new UserSmallInfo(user));
        this.id = data?.id;
        this.productId = store.getters['productCore/productId'];
        this.name = new FieldInfo({
            type: FieldType.Text,
            key: 'name',
            value: data?.name || '',
            label: String(i18n.t('common.groups.name')),
            placeholder: String(i18n.t('common.groups.name')),
            validationRules: 'required',
        });
        this.userIds = new FieldInfo({
            type: FieldType.MultiSelect,
            key: 'users',
            value: users || [],
            label: String(i18n.t('common.groups.adminAdd')),
            placeholder: String(i18n.t('placeholder.filter.admin')),
            fetchOptionsActionName: 'users/fetchUsersList',
        });
        this.permissions = data?.permissions || [];
    }
}
//# sourceMappingURL=group.js.map