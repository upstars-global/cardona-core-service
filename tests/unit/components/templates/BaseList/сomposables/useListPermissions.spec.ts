import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const permissionsMock = {
  canCreate: true,
  canUpdate: true,
  canUpdateSeo: true,
  canRemove: true,
  canExport: true,
}

vi.mock('../../../../../../src/helpers/base-permissions', () => ({
  basePermissions: () => ({ ...permissionsMock }),
}))

const { useListPermissions } = await import('../../../../../../src/components/templates/BaseList/сomposables/useListPermissions')

const baseCtx = (overrides: Partial<{
  isExistsCreatePage: boolean
  isExistsUpdatePage: boolean
  isExistsDetailsPage: boolean
  UpdatePageName: string
  DetailsPageName: string
  canUpdateCb: (item?: any) => boolean
  canRemoveCb: (item?: any) => boolean
  canCopyCb: (item?: any) => boolean
}> = {}) => ({
  entityName: 'Tournaments',
  isExistsCreatePage: true,
  isExistsUpdatePage: true,
  isExistsDetailsPage: true,
  UpdatePageName: 'TournamentsUpdate',
  DetailsPageName: 'TournamentsCard',
  ...overrides,
}) as any

describe('useListPermissions', () => {
  beforeEach(() => {
    permissionsMock.canCreate = true
    permissionsMock.canUpdate = true
    permissionsMock.canRemove = true
  })

  it('shows the create button only when withCreateBtn, the page exists and canCreate are all true', () => {
    const permsAllTrue = useListPermissions(baseCtx(), { config: { withCreateBtn: true } }, ref(''))

    expect(permsAllTrue.isShownCreateBtn).toBe(true)

    const permsNoPage = useListPermissions(baseCtx({ isExistsCreatePage: false }), { config: { withCreateBtn: true } }, ref(''))

    expect(permsNoPage.isShownCreateBtn).toBe(false)

    const permsNoConfigFlag = useListPermissions(baseCtx(), { config: { withCreateBtn: false } }, ref(''))

    expect(permsNoConfigFlag.isShownCreateBtn).toBe(false)
  })

  describe('canUpdateItem', () => {
    it('uses isExistsUpdatePage alone when there is no canUpdateCb', () => {
      const { canUpdateItem } = useListPermissions(baseCtx(), { config: {} }, ref(''))

      expect(canUpdateItem({ id: 1 })).toBe(true)
      expect(canUpdateItem()).toBe(true)
    })

    it('combines isExistsUpdatePage with canUpdateCb(item) only when an item is given', () => {
      const canUpdateCb = vi.fn(() => false)
      const { canUpdateItem } = useListPermissions(baseCtx({ canUpdateCb }), { config: {} }, ref(''))

      expect(canUpdateItem({ id: 1 })).toBe(false)
      expect(canUpdateCb).toHaveBeenCalledWith({ id: 1 })

      canUpdateCb.mockClear()
      expect(canUpdateItem()).toBe(true)
      expect(canUpdateCb).not.toHaveBeenCalled()
    })
  })

  describe('canRemoveItem', () => {
    it('falls back to canRemove alone when there is no canRemoveCb', () => {
      const { canRemoveItem } = useListPermissions(baseCtx(), { config: {} }, ref(''))

      expect(canRemoveItem({ id: 1 })).toBe(true)
    })

    it('requires both canRemove and canRemoveCb(item) to be true', () => {
      permissionsMock.canRemove = true

      const canRemoveCb = vi.fn(() => false)
      const { canRemoveItem } = useListPermissions(baseCtx({ canRemoveCb }), { config: {} }, ref(''))

      expect(canRemoveItem({ id: 1 })).toBe(false)
      expect(canRemoveCb).toHaveBeenCalledWith({ id: 1 })
    })
  })

  describe('canCopyItem', () => {
    it('defaults to true when there is no canCopyCb', () => {
      const { canCopyItem } = useListPermissions(baseCtx(), { config: {} }, ref(''))

      expect(canCopyItem({ id: 1 })).toBe(true)
    })

    it('delegates to canCopyCb(item) when it is provided', () => {
      const canCopyCb = vi.fn(() => false)
      const { canCopyItem } = useListPermissions(baseCtx({ canCopyCb }), { config: {} }, ref(''))

      expect(canCopyItem({ id: 1 })).toBe(false)
      expect(canCopyCb).toHaveBeenCalledWith({ id: 1 })
    })
  })

  describe('canDraggable', () => {
    it('requires canUpdate and config.draggable to be true', () => {
      permissionsMock.canUpdate = false

      const { canDraggable } = useListPermissions(baseCtx(), { config: { draggable: true } }, ref(''))

      expect(canDraggable.value).toBeFalsy()
    })

    it('is disabled while searching when config.small is true', () => {
      const searchQuery = ref('')
      const { canDraggable } = useListPermissions(baseCtx(), { config: { small: true, draggable: true } }, searchQuery)

      expect(canDraggable.value).toBe(true)

      searchQuery.value = 'foo'
      expect(canDraggable.value).toBeFalsy()
    })

    it('ignores searchQuery when config.small is false', () => {
      const searchQuery = ref('foo')
      const { canDraggable } = useListPermissions(baseCtx(), { config: { small: false, draggable: true } }, searchQuery)

      expect(canDraggable.value).toBe(true)
    })
  })

  describe('getUpdateRoute / getDetailsRoute', () => {
    it('returns the update route when the page exists and canUpdateCb (called with no args) is not false', () => {
      const { getUpdateRoute } = useListPermissions(baseCtx(), { config: {} }, ref(''))

      expect(getUpdateRoute({ id: 42 })).toEqual({ name: 'TournamentsUpdate', params: { id: 42 } })
    })

    it('returns an empty route when the update page does not exist', () => {
      const { getUpdateRoute } = useListPermissions(baseCtx({ isExistsUpdatePage: false }), { config: {} }, ref(''))

      expect(getUpdateRoute({ id: 42 })).toEqual({})
    })

    it('returns the details route only when the details page exists', () => {
      const { getDetailsRoute } = useListPermissions(baseCtx(), { config: {} }, ref(''))

      expect(getDetailsRoute({ id: 42 })).toEqual({ name: 'TournamentsCard', params: { id: 42 } })

      const { getDetailsRoute: getDetailsRouteMissing } = useListPermissions(baseCtx({ isExistsDetailsPage: false }), { config: {} }, ref(''))

      expect(getDetailsRouteMissing({ id: 42 })).toEqual({})
    })
  })
})
