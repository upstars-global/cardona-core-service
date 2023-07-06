export class RouterConfig {
    name;
    sectionName;
    isProject;
    isPermissionGroup;
    isConvertName;
    constructor({ name, sectionName, isProject, isPermissionGroup, isConvertName }) {
        this.name = name;
        this.sectionName = sectionName;
        this.isProject = isProject;
        this.isPermissionGroup = isPermissionGroup;
        this.isConvertName = isConvertName;
    }
}
//# sourceMappingURL=router.js.map