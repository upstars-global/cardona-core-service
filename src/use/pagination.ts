import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStorage, setStorage } from '../helpers/storage'

interface PaginationConfig {
  defaultCurrentPage?: number
  defaultPerPageOptions?: Array<number>
  defaultPerPage?: number
  withIndependentPagination?: boolean
  isUseRouter?: boolean
  storageKey: string
}

export interface PaginationResult {
  linkGen: (pageNum: number) => any | undefined
  perPageOptions: Array<number>
  perPage: Ref<number>
  total: Ref<number>
  setupDataMeta: (refTable: any) => ComputedRef<{ from: number; to: number; of: number }>
  numberOfPages: Ref<number>
  setPerPage: (value: number) => void
  setPage: (page?: number, perPageProps?: any) => void
  currentPage: Ref<number>
  updateTotal: (value: number) => void
  onChangePagination: (cb: Function) => void
}

export default function usePagination(
  config: PaginationConfig = { storageKey: 'list-perPage' },
): PaginationResult {
  const {
    defaultCurrentPage = 1,
    defaultPerPageOptions = [10, 25, 50, 100],
    defaultPerPage = defaultPerPageOptions[0],
    withIndependentPagination = false,
    isUseRouter = true,
    storageKey,
  } = config

  const route = useRoute()
  const router = useRouter()
  const { query } = route

  const perPageOptions: Array<number> = defaultPerPageOptions
  const total = ref(0)
  const numberOfPages = ref(0)
  const CbFunction = ref()

  const currentPage = ref(
    isUseRouter ? Number(query.page) || defaultCurrentPage : defaultCurrentPage,
  )

  const perPageFromStorage = getStorage<string>(storageKey)

  const perPageValue
    = isUseRouter && query.perPage ? query.perPage : perPageFromStorage || defaultPerPage

  const perPage = ref(Number(perPageValue))

  const setupDataMeta = (refTable: any) =>
    computed(() => {
      const localItemsCount: number = refTable.value ? refTable.value.localItems.length : 0

      return {
        from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
        to: perPage.value * (currentPage.value - 1) + localItemsCount,
        of: total.value,
      }
    })

  const setPerPage = (value: number) => {
    if (isUseRouter) {
      router.push({
        query: {
          ...route.value.query,
          perPage: value,
        },
      } as any)
    }
    else {
      perPage.value = value
      CbFunction.value()
    }

    setStorage(storageKey, value)
  }

  const setPage = (page = 1, perPageProps: any = null) => {
    if (isUseRouter) {
      router.push({
        query: {
          ...route.value.query,
          page,
          perPage: perPageProps || perPage.value,
        },
      } as any)
    }
    else {
      currentPage.value = page
      if (perPageProps)
        setPerPage(perPageProps)
    }
  }

  const linkGen = (pageNum: number) => {
    if (!isUseRouter)
      return

    return {
      query: {
        perPage: perPage.value,
        ...route.value.query,
        page: pageNum,
      },
    }
  }

  watch([route], () => {
    currentPage.value = Number(route.value.query.page) || 1
    perPage.value = Number(route.value.query.perPage) || defaultPerPage
  })

  const onChangePagination = (cb: Function) => {
    CbFunction.value = cb
    watch([route, currentPage], () => {
      cb()
    })
  }

  const updateTotal = (value: number) => {
    total.value = value
    numberOfPages.value = Math.ceil(value / perPage.value)

    if (currentPage.value > numberOfPages.value && numberOfPages.value !== 0) {
      if (withIndependentPagination) {
        currentPage.value--

        return
      }

      if (isUseRouter) {
        router.push({
          query: {
            ...route.value.query,
            perPage: perPage.value,
            page: numberOfPages.value,
          },
        } as any)
      }
      else {
        currentPage.value = numberOfPages.value
      }
    }
  }

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
  }
}
