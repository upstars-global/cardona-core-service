import ApiService from '../../services/api';
import { ListData } from '../../@model';
export default {
    namespaced: true,
    actions: {
        async fetchTags({ rootGetters }) {
            return new ListData(await ApiService.request({
                type: 'App.V2.Tags.List',
                filter: {
                    project: rootGetters.selectedProject.alias,
                },
            }));
        },
    },
};
//# sourceMappingURL=tags.js.map