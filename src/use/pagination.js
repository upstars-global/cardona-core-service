import { ref, watch, computed } from 'vue';
import { useRouter } from '../@core/utils/utils';
import { getStorage, setStorage } from '../helpers/storage';
export default function usePagination(config = { storageKey: 'list-perPage' }) {
    const { defaultCurrentPage = 1, defaultPerPageOptions = [10, 25, 50, 100], defaultPerPage = defaultPerPageOptions[0], withIndependentPagination = false, isUseRouter = true, storageKey, } = config;
    const { route, router } = useRouter();
    const { query } = route.value;
    const perPageOptions = defaultPerPageOptions;
    const total = ref(0);
    const numberOfPages = ref(0);
    const CbFunction = ref();
    const currentPage = ref(isUseRouter ? Number(query.page) || defaultCurrentPage : defaultCurrentPage);
    const perPageFromStorage = getStorage(storageKey);
    const perPageValue = isUseRouter && query.perPage ? query.perPage : perPageFromStorage || defaultPerPage;
    const perPage = ref(Number(perPageValue));
    const setupDataMeta = (refTable) => computed(() => {
        const localItemsCount = refTable.value ? refTable.value.localItems.length : 0;
        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: total.value,
        };
    });
    const setPerPage = (value) => {
        if (isUseRouter) {
            router.push({
                query: {
                    ...route.value.query,
                    perPage: value,
                },
            });
        }
        else {
            perPage.value = value;
            CbFunction.value();
        }
        setStorage(storageKey, value);
    };
    const setPage = (page = 1, perPageProps = null) => {
        if (isUseRouter) {
            router.push({
                query: {
                    ...route.value.query,
                    page,
                    perPage: perPageProps || perPage.value,
                },
            });
        }
        else {
            currentPage.value = page;
            if (perPageProps) {
                setPerPage(perPageProps);
            }
        }
    };
    const linkGen = (pageNum) => {
        if (!isUseRouter) {
            return;
        }
        return {
            query: {
                perPage: perPage.value,
                ...route.value.query,
                page: pageNum,
            },
        };
    };
    watch([route], () => {
        currentPage.value = Number(route.value.query.page) || 1;
        perPage.value = Number(route.value.query.perPage) || defaultPerPage;
    });
    const onChangePagination = (cb) => {
        CbFunction.value = cb;
        watch([route, currentPage], () => {
            cb();
        });
    };
    const updateTotal = (value) => {
        total.value = value;
        numberOfPages.value = Math.ceil(value / perPage.value);
        if (currentPage.value > numberOfPages.value && numberOfPages.value !== 0) {
            if (withIndependentPagination) {
                currentPage.value--;
                return;
            }
            if (isUseRouter) {
                router.push({
                    query: {
                        ...route.value.query,
                        perPage: perPage.value,
                        page: numberOfPages.value,
                    },
                });
            }
            else {
                currentPage.value = numberOfPages.value;
            }
        }
    };
    return {
        linkGen,
        perPageOptions,
        perPage,
        total,
        setupDataMeta,
        numberOfPages,
        setPerPage,
        setPage,
        currentPage,
        updateTotal,
        onChangePagination,
    };
}
//# sourceMappingURL=pagination.js.map