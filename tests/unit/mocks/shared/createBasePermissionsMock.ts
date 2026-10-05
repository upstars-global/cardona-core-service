import { vi } from 'vitest'

export interface BasePermissionsShape {
  canCreate?: boolean
  canCreateSeo?: boolean
  canUpdate?: boolean
  canUpdateSeo?: boolean
  canRemove?: boolean
  canViewSeo?: boolean
  canExport?: boolean
}

const defaults: Required<BasePermissionsShape> = {
  canCreate: true,
  canCreateSeo: true,
  canUpdate: true,
  canUpdateSeo: true,
  canRemove: true,
  canViewSeo: true,
  canExport: true,
}

/**
 * Shared mock for `basePermissions` (src/helpers/base-permissions.ts).
 *
 * Both BaseList and BaseSection gate their create/update/remove UI through this single helper
 * (canCreate/canUpdate/canRemove/...), not through per-row business predicates — those (e.g.
 * vipSeasons' canUpdateCb) stay out of scope. `setPermissions` lets a contract flip one flag per
 * test to assert the gated element appears/disappears, then `reset` restores the file's default.
 */
export function createBasePermissionsMock(initial: BasePermissionsShape = {}) {
  const initialValues = { ...defaults, ...initial }
  let current = { ...initialValues }

  const basePermissions = vi.fn(() => ({ ...current }))

  const setPermissions = (overrides: BasePermissionsShape) => {
    current = { ...current, ...overrides }
  }

  const reset = () => {
    current = { ...initialValues }
  }

  return { basePermissions, setPermissions, reset }
}
