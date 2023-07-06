import i18n from '../../../libs/i18n';
export var SortDirection;
(function (SortDirection) {
    SortDirection["asc"] = "ASC";
    SortDirection["desc"] = "DESC";
})(SortDirection || (SortDirection = {}));
export class BaseListConfig {
    withSearch;
    withDeactivation;
    withSettings;
    skeletonRows;
    skeletonColumns;
    emptyText;
    filterList;
    staticFilters;
    staticSorts;
    responsive;
    selectMode;
    selectable;
    small;
    draggable;
    defaultPerPage;
    withIndependentPagination;
    searchPlaceholder;
    withExport;
    withMultipleActions;
    sidebar;
    sidebarCollapseMode;
    isShowYou;
    isShowUpdatePassword;
    onePermissionKey;
    withRemoveComment;
    withRemoveModal;
    createFromCopy;
    withCustomDrag;
    pagination;
    withCreateBtn;
    withCustomFetchList;
    withCustomDelete;
    noPermissionPrefix;
    permissionKey;
    customModuleName;
    customApiPrefix;
    customPermissionPrefix;
    constructor({ withSearch, withDeactivation, withSettings, skeletonRows, skeletonColumns, emptyText, filterList, staticFilters, staticSorts, responsive, selectMode, selectable, small, draggable, defaultPerPage, withIndependentPagination, searchPlaceholder, withExport, withMultipleActions, sidebar, sidebarCollapseMode, isShowYou, isShowUpdatePassword, onePermissionKey, withRemoveComment, withRemoveModal, createFromCopy, withCustomDrag, pagination, withCreateBtn, withCustomFetchList, withCustomDelete, noPermissionPrefix, permissionKey, customModuleName, customApiPrefix, customPermissionPrefix, }) {
        this.withSearch = withSearch;
        this.withDeactivation = withDeactivation;
        this.withSettings = withSettings;
        this.skeletonRows = skeletonRows || 10;
        this.skeletonColumns = skeletonColumns || 4;
        this.emptyText = emptyText || String(i18n.t('emptyState.list'));
        this.filterList = filterList || [];
        this.staticFilters = staticFilters || {};
        this.staticSorts = staticSorts;
        this.responsive = responsive;
        this.selectMode = selectMode;
        this.selectable = selectable;
        this.small = small;
        this.draggable = draggable;
        this.defaultPerPage = defaultPerPage;
        this.withIndependentPagination = withIndependentPagination;
        this.searchPlaceholder = searchPlaceholder;
        this.withExport = withExport;
        this.withMultipleActions = withMultipleActions;
        this.sidebar = sidebar;
        this.sidebarCollapseMode = sidebarCollapseMode;
        this.isShowYou = isShowYou;
        this.isShowUpdatePassword = isShowUpdatePassword;
        this.onePermissionKey = onePermissionKey;
        this.withRemoveComment = withRemoveComment;
        this.withRemoveModal = withRemoveModal;
        this.withCustomDrag = withCustomDrag;
        this.pagination = pagination ?? true;
        this.createFromCopy = createFromCopy;
        this.withCreateBtn = withCreateBtn ?? true;
        this.withCustomFetchList = withCustomFetchList;
        this.withCustomDelete = withCustomDelete;
        this.noPermissionPrefix = noPermissionPrefix;
        this.permissionKey = permissionKey;
        this.customModuleName = customModuleName;
        this.customApiPrefix = customApiPrefix;
        this.customPermissionPrefix = customPermissionPrefix;
    }
}
export class BaseSectionConfig {
    onePermissionKey;
    permissionKey;
    withCustomModuleName;
    noPermissionPrefix;
    customModuleName;
    customApiPrefix;
    loadingEndpointArr;
    customPermissionPrefix;
    constructor(data) {
        this.permissionKey = data?.permissionKey;
        this.onePermissionKey = data?.onePermissionKey;
        this.withCustomModuleName = data?.withCustomModuleName;
        this.noPermissionPrefix = data?.noPermissionPrefix;
        this.customModuleName = data?.customModuleName;
        this.customApiPrefix = data?.customApiPrefix;
        this.loadingEndpointArr = data?.loadingEndpointArr || [];
        this.customPermissionPrefix = data?.customPermissionPrefix;
    }
}
// Export
export var ExportFormat;
(function (ExportFormat) {
    ExportFormat["JSON"] = "json";
    ExportFormat["CSV"] = "csv";
})(ExportFormat || (ExportFormat = {}));
export var DownloadFormat;
(function (DownloadFormat) {
    DownloadFormat["json"] = "application/json";
    DownloadFormat["csv"] = "text/csv";
})(DownloadFormat || (DownloadFormat = {}));
export class SideBarCollapseItem {
    title;
    withBottomSeparator;
    views;
    constructor(data) {
        this.title = data.title;
        this.withBottomSeparator = data?.withBottomSeparator;
        this.views = data.views;
    }
}
//# sourceMappingURL=model.js.map