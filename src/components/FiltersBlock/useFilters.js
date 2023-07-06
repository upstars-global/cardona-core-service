import { ref } from 'vue';
import coreFilters from './filters';
import productFilters from '@filterConfig';
const allFilters = { ...coreFilters, ...productFilters };
export const useFilters = (initFilters) => {
    const filters = ref([]);
    const selectedFilters = ref([]);
    filters.value = initFilters.map((filter) => allFilters[filter.type]);
    const onChangeSelectedFilters = (filters) => {
        selectedFilters.value = filters;
    };
    return {
        filters,
        selectedFilters,
        onChangeSelectedFilters,
    };
};
//# sourceMappingURL=useFilters.js.map