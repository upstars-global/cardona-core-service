import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListPermissionLevel, PermissionLevel } from '../../../src/@model/permission'

vi.mock('../../../src/stores/user', () => ({
  useUserStore: vi.fn(),
}))

vi.mock('../../../src/helpers', () => ({
  getPermissionKeys: vi.fn(),
}))

vi.mock('@productConfig', () => ({
  permissionPrefix: 'admin',
}))

const { useUserStore } = await import('../../../src/stores/user')
const { getPermissionKeys } = await import('../../../src/helpers')
const { basePermissions } = await import('../../../src/helpers/base-permissions')

describe('basePermissions', () => {
  const setupMocks = (
    abilityCan: ReturnType<typeof vi.fn>,
    permissionKeys = {
      permissionKey: 'adminproducts',
      permissionKeySeo: 'adminproductsseo',
      permissionKeyReport: 'adminproductsreport',
    },
  ) => {
    vi.mocked(useUserStore).mockReturnValue({ abilityCan } as any)
    vi.mocked(getPermissionKeys).mockReturnValue(permissionKeys)
  }

  const createMockAbilityCan = (returnValue: boolean | ((key: string, action: PermissionLevel) => boolean)) => {
    return typeof returnValue === 'function'
      ? vi.fn().mockImplementation(returnValue)
      : vi.fn().mockReturnValue(returnValue)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('positive cases', () => {
    it('returns permissions based on userStore.abilityCan', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {},
      })

      expect(result.canCreate).toBe(true)
      expect(result.canUpdate).toBe(true)
      expect(result.canRemove).toBe(true)
      expect(result.canExport).toBe(true)
      expect(mockAbilityCan).toHaveBeenCalledWith('adminproducts', PermissionLevel.create)
      expect(mockAbilityCan).toHaveBeenCalledWith('adminproducts', PermissionLevel.update)
      expect(mockAbilityCan).toHaveBeenCalledWith('adminproducts', PermissionLevel.delete)
    })

    it('returns all true when noPermissions is true', () => {
      const mockAbilityCan = vi.fn()

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: { noPermissions: true as any },
      })

      expect(result.canCreate).toBe(true)
      expect(result.canUpdate).toBe(true)
      expect(result.canUpdateSeo).toBe(true)
      expect(result.canCreateSeo).toBe(true)
      expect(result.canViewSeo).toBe(true)
      expect(result.canRemove).toBe(true)
      expect(result.canExport).toBe(true)
      expect(mockAbilityCan).not.toHaveBeenCalled()
    })

    it('returns true for specific permissions in noPermissions array', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.create, ListPermissionLevel.export],
        },
      })

      expect(result.canCreate).toBe(true)
      expect(result.canExport).toBe(true)
    })

    it('returns true for all seo operations when noPermissions includes seo', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.seo],
        },
      })

      expect(result.canCreateSeo).toBe(true)
      expect(result.canUpdateSeo).toBe(true)
      expect(result.canViewSeo).toBe(true)
    })

    it('returns true for specific seo operation when in noPermissions array', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.seoCreate],
        },
      })

      expect(result.canCreateSeo).toBe(true)
    })

    it('uses onePermissionKey when provided', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan)

      basePermissions({
        entityName: 'products',
        config: {
          onePermissionKey: 'superadmin',
        },
      })

      expect(mockAbilityCan).toHaveBeenCalledWith('superadmin', PermissionLevel.view)
      expect(mockAbilityCan).not.toHaveBeenCalledWith('adminproducts', PermissionLevel.create)
    })

    it('uses custom permissionKey when provided', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan, {
        permissionKey: 'custom-products',
        permissionKeySeo: 'custom-productsseo',
        permissionKeyReport: 'custom-productsreport',
      })

      basePermissions({
        entityName: 'products',
        config: {
          permissionKey: 'custom-products',
        },
      })

      expect(mockAbilityCan).toHaveBeenCalledWith('custom-products', PermissionLevel.create)
    })

    it('uses customPermissionPrefix when provided', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan, {
        permissionKey: 'superproducts',
        permissionKeySeo: 'superproductsseo',
        permissionKeyReport: 'superproductsreport',
      })

      basePermissions({
        entityName: 'products',
        config: {
          customPermissionPrefix: 'super',
        },
      })

      expect(mockAbilityCan).toHaveBeenCalledWith('superproducts', PermissionLevel.create)
    })

    it('removes prefix when noPermissionPrefix is true', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan, {
        permissionKey: 'products',
        permissionKeySeo: 'productsseo',
        permissionKeyReport: 'productsreport',
      })

      basePermissions({
        entityName: 'products',
        config: {
          noPermissionPrefix: true,
        },
      })

      expect(mockAbilityCan).toHaveBeenCalledWith('products', PermissionLevel.create)
    })

    it('replaces dashes in entityName', () => {
      const mockAbilityCan = createMockAbilityCan(true)

      setupMocks(mockAbilityCan, {
        permissionKey: 'adminproductcategories',
        permissionKeySeo: 'adminproductcategoriesseo',
        permissionKeyReport: 'adminproductcategoriesreport',
      })

      basePermissions({
        entityName: 'product-categories',
        config: {},
      })

      expect(mockAbilityCan).toHaveBeenCalledWith('adminproductcategories', PermissionLevel.create)
    })

    it('handles combined noPermissions and userStore permissions', () => {
      const mockAbilityCan = createMockAbilityCan((key, action) => action === PermissionLevel.update)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.create],
        },
      })

      expect(result.canCreate).toBe(true)
      expect(result.canUpdate).toBe(true)
    })
  })

  describe('negative cases', () => {
    it('returns false when userStore.abilityCan returns false', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {},
      })

      expect(result.canCreate).toBe(false)
      expect(result.canUpdate).toBe(false)
      expect(result.canRemove).toBe(false)
    })

    it('returns false for non-included permissions when noPermissions is array', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.create],
        },
      })

      expect(result.canUpdate).toBe(false)
      expect(result.canRemove).toBe(false)
      expect(result.canExport).toBe(false)
    })

    it('returns false for seo operations when seo not in noPermissions', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.create],
        },
      })

      expect(result.canCreateSeo).toBe(false)
      expect(result.canUpdateSeo).toBe(false)
      expect(result.canViewSeo).toBe(false)
    })

    it('returns false when onePermissionKey check fails', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          onePermissionKey: 'superadmin',
        },
      })

      expect(result.canCreate).toBe(false)
      expect(result.canUpdate).toBe(false)
      expect(result.canRemove).toBe(false)
      expect(mockAbilityCan).toHaveBeenCalledWith('superadmin', PermissionLevel.view)
    })

    it('returns false for other seo operations when only seoCreate in noPermissions', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [ListPermissionLevel.seoCreate],
        },
      })

      expect(result.canUpdateSeo).toBe(false)
      expect(result.canViewSeo).toBe(false)
    })

    it('returns false with empty noPermissions array', () => {
      const mockAbilityCan = createMockAbilityCan(false)

      setupMocks(mockAbilityCan)

      const result = basePermissions({
        entityName: 'products',
        config: {
          noPermissions: [],
        },
      })

      expect(result.canCreate).toBe(false)
      expect(result.canUpdate).toBe(false)
      expect(result.canRemove).toBe(false)
      expect(result.canExport).toBe(false)
    })
  })

  it('calls getPermissionKeys with correct params', () => {
    const mockAbilityCan = createMockAbilityCan(true)
    setupMocks(mockAbilityCan)

    basePermissions({
      entityName: 'products',
      config: { customPermissionPrefix: 'super' },
    })

    expect(getPermissionKeys).toHaveBeenCalledWith({
      permissionKey: undefined,
      permissionPrefix: 'super',
      entityNamePermission: 'products',
    })
  })

  it('handles seo with other permissions in noPermissions', () => {
    const mockAbilityCan = createMockAbilityCan(false)
    setupMocks(mockAbilityCan)

    const result = basePermissions({
      entityName: 'products',
      config: {
        noPermissions: [ListPermissionLevel.seo, ListPermissionLevel.create],
      },
    })

    expect(result.canCreate).toBe(true)
    expect(result.canCreateSeo).toBe(true)
    expect(result.canUpdateSeo).toBe(true)
    expect(result.canUpdate).toBe(false)
  })

  it('handles multiple specific seo permissions', () => {
    const mockAbilityCan = createMockAbilityCan(false)
    setupMocks(mockAbilityCan)

    const result = basePermissions({
      entityName: 'products',
      config: {
        noPermissions: [ListPermissionLevel.seoCreate, ListPermissionLevel.seoUpdate],
      },
    })

    expect(result.canCreateSeo).toBe(true)
    expect(result.canUpdateSeo).toBe(true)
    expect(result.canViewSeo).toBe(false)
  })
})
