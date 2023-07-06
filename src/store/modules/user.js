import router from '../../router';
import { setStorage } from '../../helpers/storage';
import { storageKeys } from '../../configs/storage';
import { ProjectInfo } from '../../@model/project';
import { UserInfo } from '../../@model/user';
import { Permission, AllPermission } from '../../@model/permission';
import ApiService from '../../services/api';
import { productName } from '@productConfig';
export const fetchCurrentUser = async () => {
    const { data } = await ApiService.request({
        type: 'App.V2.Users.Current.Read',
    });
    const [firstName, lastName] = (data.fullName || '').split(' ');
    return new UserInfo({
        id: data.id,
        firstName: firstName,
        lastName: lastName || '',
        userName: data.userName,
        email: data.email,
        description: data.description || '',
        roles: data.roles,
        status: UserInfo.toStatus(data.isActive),
        groups: data.groups,
        projects: data.projects.map((project) => new ProjectInfo(project)),
        products: data.products.map((project) => project),
        permissions: data.permissions.map((permission) => new Permission(permission)),
    });
};
export default {
    state: {
        accessLevels: ['noaccess', 'view', 'create', 'update', 'delete'],
        userInfo: new UserInfo(),
        permissions: new AllPermission(),
        selectedProduct: null,
        selectedProject: null,
    },
    getters: {
        userInfo: ({ userInfo }) => userInfo,
        userProjects: ({ userInfo }) => userInfo.projects,
        selectedProject: ({ selectedProject }, { userProjects }) => {
            const defaultProject = userProjects[0];
            const projectIdFromStorage = localStorage.getItem(storageKeys.selectedProjectId);
            const selectedProjectInfo = userProjects.find(({ id }) => id === Number(projectIdFromStorage));
            return selectedProject || selectedProjectInfo || defaultProject;
        },
        selectedProduct: ({ selectedProduct }) => selectedProduct,
        isNeocore: ({ selectedProduct }) => selectedProduct?.id.toString() === '1',
        getSpecificProject: ({ userInfo }) => (projectAlias) => userInfo.projects.find((project) => project.alias === projectAlias),
        canViewVCoinInProject: ({ userInfo }) => (projectAlias) => {
            const project = userInfo.projects.find((item) => item.alias === projectAlias);
            return project?.integrations?.vCoins;
        },
        abilityCan: ({ accessLevels, userInfo }) => (target, access) => {
            if (typeof access === 'string')
                access = accessLevels.indexOf(access.toLowerCase());
            const permission = userInfo.permissions.find((permission) => permission.target === target);
            return permission && permission.access >= access;
        },
        abilityCanInGroup: ({ accessLevels, permissions }, { abilityCan }) => (group, access, all = false) => {
            if (typeof access === 'string')
                access = accessLevels.indexOf(access.toLowerCase());
            if (Array.isArray(group)) {
                if (all)
                    return group.every((item) => abilityCan(item, access));
                return group.some((item) => abilityCan(item, access));
            }
            const groups = permissions.allPermission[group];
            if (all)
                return groups.every((item) => abilityCan(item.target, access));
            return groups.some((item) => abilityCan(item.target, access));
        },
    },
    mutations: {
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo;
            state.permissions.setAccessAllPermission(userInfo.permissions);
            state.selectedProduct = userInfo.products.find(({ name }) => name === productName);
        },
        SET_SELECTED_PROJECT(state, project) {
            state.selectedProject = project;
        },
        SET_SELECTED_PRODUCT(state, product) {
            state.selectedProduct = product;
        },
    },
    actions: {
        async fetchCurrentUser({ commit }) {
            const currentUser = await fetchCurrentUser();
            commit('SET_USER_INFO', currentUser);
        },
        setSelectedProduct({ commit }, product) {
            commit('SET_SELECTED_PRODUCT', product);
        },
        setSelectedProject({ getters, commit }, project) {
            const { selectedProject } = getters;
            const { currentRoute } = router;
            const changingProjectRouteName = currentRoute.meta.changingProjectRouteName;
            const isSameProject = selectedProject?.id === project.id;
            setStorage(storageKeys.selectedProjectId, project.id);
            commit('SET_SELECTED_PROJECT', project);
            if (!isSameProject) {
                if (changingProjectRouteName) {
                    router.push({
                        name: changingProjectRouteName,
                        params: { ...currentRoute.params, project: project.alias },
                    });
                }
                else if (currentRoute.matched?.[0]?.path.includes(':project')) {
                    router.push({ params: { ...currentRoute.params, project: project.alias } });
                }
            }
        },
    },
};
//# sourceMappingURL=user.js.map