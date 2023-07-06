export default {
    namespaced: true,
    state: {
        entityName: '',
        listPath: '',
        listFilters: [],
    },
    getters: {
        listEntityName: ({ entityName }) => entityName,
        listPath: ({ listPath }) => listPath,
        appliedListFilters: ({ listFilters }) => listFilters,
    },
    mutations: {
        SET_LIST_ENTITY_NAME(state, entityName = '') {
            state.entityName = entityName;
        },
        SET_LIST_PATH(state, path = '') {
            state.listPath = path;
        },
        SET_LIST_FILTERS(state, filters = []) {
            state.listFilters = filters;
        },
    },
};
//# sourceMappingURL=filtersCore.js.map