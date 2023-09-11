import usePagination from '../../../src/use/pagination'

jest.mock('../../../src/@core/utils/utils', () => ({
  useRouter: () => ({
    route: {
      value: {
        query: {
          page: '1',
        },
      },
    },
    router: {
      push: jest.fn(),
    },
  }),
}))

describe('usePagination', () => {
  it('should return default values when no config is provided', () => {
    const pagination = usePagination({
      defaultPerPage: 10,
      isUseRouter: false,
      storageKey: '',
    })

    expect(pagination.perPage.value).toBe(10)
    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.perPageOptions).toEqual([10, 25, 50, 100])
  })

  it('should set currentPage when calling setPage', () => {
    const pagination = usePagination({
      defaultPerPage: 25,
      isUseRouter: false,
      storageKey: '',
    })
    pagination.setPage(3)
    expect(pagination.currentPage.value).toBe(3)
  })
})
