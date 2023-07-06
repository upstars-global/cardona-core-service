export class UserSmallInfo {
    id;
    name;
    constructor({ id, userName }) {
        this.id = Number(id);
        this.name = userName;
    }
}
export class ProjectInfo {
    id;
    name;
    publicName;
    alias;
    websiteUrl;
    users;
    integrations;
    iconPath;
    originProject;
    mainLocale;
    locales;
    constructor(project) {
        this.id = Number(project.id);
        this.name = project.name;
        this.publicName = project.publicName;
        this.users = project.users;
        this.alias = project.alias;
        this.websiteUrl = project.websiteUrl;
        this.integrations = project.integrations ? project.integrations : null;
        this.iconPath = project.iconPath || null;
        this.originProject = project;
        this.mainLocale = project.mainLocale;
        this.locales = project.locales;
    }
}
export class ProjectOriginData {
    //TODO: Думаю можно будет удалить, когда будем переводить на базовый раздел
    id;
    name;
    publicName;
    alias;
    majorApiVer;
    websiteUrl;
    clientId;
    privateKey;
    callbackUrl;
    url;
    wlIdentifier;
    alaroConfigName;
    marbellaUrl;
    marbellaPublicKey;
    marbellaPrivateKey;
    valenciaMerchantName;
    vcoinsUrl;
    imagePath;
    users;
    mainLocale;
    locales;
    constructor(data) {
        if (data?.id)
            this.id = data.id;
        this.name = data?.name || '';
        this.publicName = data?.publicName || '';
        this.alias = data?.alias || '';
        this.majorApiVer = data?.majorApiVer || null;
        this.websiteUrl = data?.websiteUrl || '';
        this.clientId = data?.clientId || '';
        this.privateKey = data?.privateKey || '';
        this.callbackUrl = data?.callbackUrl || '';
        this.url = data?.url || '';
        this.wlIdentifier = data?.wlIdentifier || '';
        this.alaroConfigName = data?.alaroConfigName || '';
        this.marbellaUrl = data?.marbellaUrl || '';
        this.marbellaPublicKey = data?.marbellaPublicKey || '';
        this.marbellaPrivateKey = data?.marbellaPrivateKey || '';
        this.valenciaMerchantName = data?.valenciaMerchantName || '';
        this.vcoinsUrl = data?.vcoinsUrl || '';
        this.imagePath = data?.imagePath || '';
        this.users = data?.users || [];
        this.mainLocale = data?.mainLocale || '';
        this.locales = data?.locales || [];
    }
}
export class ProjectSubmissionData extends ProjectOriginData {
    userIds;
    constructor(data) {
        super(data);
        this.userIds = data.users?.map(({ id }) => id) || [];
    }
}
//# sourceMappingURL=project.js.map