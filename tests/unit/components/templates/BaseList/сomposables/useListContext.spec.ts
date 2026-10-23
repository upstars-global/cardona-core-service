import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetchEntityList = vi.fn()
const mockDeleteEntity = vi.fn()
const mockMultipleDeleteEntity = vi.fn()
const mockFetchReport = vi.fn()

vi.mock('../../../../../../src/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => ({
    fetchEntityList: mockFetchEntityList,
    deleteEntity: mockDeleteEntity,
    multipleDeleteEntity: mockMultipleDeleteEntity,
    fetchReport: mockFetchReport,
  }),
}))

let existingRouteNames: string[] = []

vi.mock('vue-router', () => ({
  useRouter: () => ({
    getRoutes: () => existingRouteNames.map(name => ({ name })),
  }),
}))

const { parseEntityNameWithTabs, useListContext } = await import('../../../../../../src/components/templates/BaseList/сomposables/useListContext')

describe('useListContext', () => {
  beforeEach(() => {
    existingRouteNames = []
    vi.clearAllMocks()
  })

  it('strips the #tab suffix from entityName', () => {
    expect(parseEntityNameWithTabs('Tournaments#overview')).toBe('Tournaments')
    expect(parseEntityNameWithTabs('Tournaments')).toBe('Tournaments')
  })

  it('derives page names from entityName (with tab stripped) when pageName is not given', () => {
    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments#overview', fields: [] }) })

    expect(ctx.CreatePageName).toBe('TournamentsCreate')
    expect(ctx.UpdatePageName).toBe('TournamentsUpdate')
    expect(ctx.DetailsPageName).toBe('TournamentsCard')
  })

  it('prefers pageName over entityName when deriving page names', () => {
    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments', pageName: 'TournamentsList', fields: [] }) })

    expect(ctx.CreatePageName).toBe('TournamentsListCreate')
    expect(ctx.UpdatePageName).toBe('TournamentsListUpdate')
    expect(ctx.DetailsPageName).toBe('TournamentsListCard')
  })

  it('flags each page as existing only when the router actually has that route', () => {
    existingRouteNames = ['TournamentsCreate', 'TournamentsCard']

    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments', fields: [] }) })

    expect(ctx.isExistsCreatePage).toBe(true)
    expect(ctx.isExistsUpdatePage).toBe(false)
    expect(ctx.isExistsDetailsPage).toBe(true)
  })

  it('falls back to baseStoreCore actions when useList provides no custom store', () => {
    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments', fields: [] }) })

    expect(ctx.fetchAction).toBe(mockFetchEntityList)
    expect(ctx.deleteAction).toBe(mockDeleteEntity)
    expect(ctx.multipleDeleteAction).toBe(mockMultipleDeleteEntity)
    expect(ctx.fetchReportAction).toBe(mockFetchReport)
    expect(ctx.customStore).toBeNull()
  })

  it('prefers the custom store action over baseStoreCore when useStore provides it', () => {
    const customFetchEntityList = vi.fn()
    const customStore = { fetchEntityList: customFetchEntityList }

    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments', fields: [], useStore: () => customStore }) })

    expect(ctx.fetchAction).toBe(customFetchEntityList)

    // the custom store has no deleteEntity/multipleDeleteEntity/fetchReport, so those still fall back
    expect(ctx.deleteAction).toBe(mockDeleteEntity)
    expect(ctx.multipleDeleteAction).toBe(mockMultipleDeleteEntity)
    expect(ctx.fetchReportAction).toBe(mockFetchReport)
  })

  it('derives entityUrl from a plain entityName', () => {
    const ctx = useListContext({ useList: () => ({ entityName: 'Tournaments', fields: [] }) })

    expect(ctx.entityUrl.value).toBe('tournaments')
  })
})
