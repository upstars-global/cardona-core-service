import { convertCamelCase } from '../helpers/index';
import { permissionPrefix } from '@productConfig';
export default function sectionRouterGenerator(sectionConfigs) {
    const arrRouters = [];
    sectionConfigs.forEach((sectionConfig) => {
        let importSTR = sectionConfig.isConvertName
            ? convertCamelCase(sectionConfig.name, '/')
            : sectionConfig.name;
        if (sectionConfig.sectionName) {
            importSTR = sectionConfig.sectionName + '/' + importSTR;
        }
        const entityUrl = sectionConfig.isProject ? '/:project/' + importSTR : '/' + importSTR;
        const entityName = sectionConfig.name[0].toUpperCase() + sectionConfig.name.slice(1);
        const permission = `${permissionPrefix}-${convertCamelCase(sectionConfig.name, '-')}`;
        arrRouters.push(...[
            {
                path: entityUrl,
                name: `${entityName}List`,
                component: () => import(`@/pages/${importSTR}/list`),
                meta: {
                    title: `${sectionConfig.name}.list`,
                    permission,
                    breadcrumb: [
                        {
                            text: `${sectionConfig.name}.list`,
                            active: true,
                        },
                    ],
                },
            },
            {
                path: `${entityUrl}/create`,
                name: `${entityName}Create`,
                component: () => import(`@/pages/${importSTR}/create`),
                meta: {
                    title: `${sectionConfig.name}.create`,
                    permission,
                    level: 'create',
                    breadcrumb: [
                        {
                            to: { name: `${entityName}List` },
                            text: `${sectionConfig.name}.list`,
                        },
                        {
                            text: `${sectionConfig.name}.create`,
                            active: true,
                        },
                    ],
                },
            },
            {
                path: `${entityUrl}/update/:id`,
                name: `${entityName}Update`,
                component: () => import(`@/pages/${importSTR}/update`),
                meta: {
                    title: `${sectionConfig.name}.edit`,
                    permissionGroup: sectionConfig.isPermissionGroup ? sectionConfig.name : undefined,
                    permission: !sectionConfig.isPermissionGroup ? permission : undefined,
                    level: 'update',
                    breadcrumb: [
                        {
                            to: { name: `${entityName}List` },
                            text: `${sectionConfig.name}.list`,
                        },
                        {
                            text: `${sectionConfig.name}.edit`,
                            active: true,
                        },
                    ],
                },
            },
        ]);
    });
    return arrRouters;
}
//# sourceMappingURL=router.js.map