import { PermissionFormType } from '../@model/enums/permissions';
export var PermissionType;
(function (PermissionType) {
    PermissionType["DemoPage"] = "demo-demo";
    PermissionType["DemoPageReport"] = "demo-demo-report";
})(PermissionType || (PermissionType = {}));
export default {
    demoPage: [
        {
            type: PermissionFormType.Table,
            target: PermissionType.DemoPage,
        },
        {
            type: PermissionFormType.Switch,
            target: PermissionType.DemoPageReport,
        },
    ],
};
//# sourceMappingURL=permissions.js.map