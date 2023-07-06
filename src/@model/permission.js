import permissions from '@permissions';
export var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel["noaccess"] = "noaccess";
    PermissionLevel["view"] = "view";
    PermissionLevel["create"] = "create";
    PermissionLevel["update"] = "update";
    PermissionLevel["delete"] = "delete";
})(PermissionLevel || (PermissionLevel = {}));
export class Permission {
    _access;
    target;
    constructor(data) {
        this._access = data.access;
        this.target = data.target;
    }
    changeAccess(access) {
        this._access = access;
    }
    get access() {
        return this._access;
    }
    toJSON() {
        return {
            access: this._access,
            target: this.target,
        };
    }
}
export class PermissionUpdatableTable extends Permission {
    type;
    trigger;
    notAccessLevel;
    constructor(data) {
        super({ ...data, access: data.access ? data.access : 0 });
        this.type = data.type;
        this.trigger = data.trigger || [];
        this.notAccessLevel = data.notAccessLevel || [0];
    }
}
export class PermissionUpdatableTableList {
    title;
    permissions;
    constructor(data) {
        this.title = data?.title;
        this.permissions = data.permissions || [];
    }
}
export class AllPermission {
    _allPermission = {
        ...permissions,
    };
    constructor(permission) {
        if (permission) {
            this.setAccessAllPermission(permission);
        }
    }
    getInitAccessByTarget(permission, target) {
        const item = permission?.find((item) => target === item.target);
        return item?.access || 0;
    }
    setAccessAllPermission(permission) {
        for (const group in this._allPermission) {
            this._allPermission[group] = this._allPermission[group].map((item) => {
                return new PermissionUpdatableTable({
                    ...item,
                    access: this.getInitAccessByTarget(permission, item.target),
                });
            });
        }
    }
    toArray() {
        const arrAllPermission = [];
        for (const group in this._allPermission) {
            arrAllPermission.push(this._allPermission[group]);
        }
        return arrAllPermission;
    }
    toPermissionArray() {
        const arrAllPermission = [];
        for (const group in this._allPermission) {
            arrAllPermission.push(...this._allPermission[group].map((item) => new Permission(item).toJSON()));
        }
        return arrAllPermission;
    }
    get allPermission() {
        return this._allPermission;
    }
}
//# sourceMappingURL=permission.js.map