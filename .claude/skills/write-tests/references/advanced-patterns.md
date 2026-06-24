# Advanced Patterns — Full Reference

## BaseList Component Tests

BaseList tests are the most complex. Always use the dedicated mock infrastructure.

```typescript
// 1. Static mock MUST be first import
import '../../../mocks/base-list/static-mock'

// 2. Import utilities from base-list/utils
import {
  getMountComponent,          // mount DefaultBaseList
  getMountCompactComponent,   // mount CompactBaseList
  defaultProps,
  fields,
  global,
  mockBaseStoreCore,
  exportDataMock,
  getSelectorCField,
  getUpdatePropsConfig,
  runActionToggleState,
  useList,
  useListForToggleStatus,
  useListForCustomStore,
} from '../../../mocks/base-list/utils'

describe('DefaultBaseList.vue', () => {
  let props

  beforeEach(() => {
    exportDataMock()             // mock window.URL.createObjectURL
    props = cloneDeep(defaultProps)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders fetched list items', async () => {
    const wrapper = getMountComponent(props, global)
    await flushPromises()

    testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
  })

  it('calls fetchEntityList with static filters', async () => {
    props = getUpdatePropsConfig({ staticFilters: { id: 2 } }, props)
    getMountComponent(props, global)
    await flushPromises()

    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ filter: expect.anything() }) }),
    )
  })
})
```

For table cell assertions:
```typescript
const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`
testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
```

---

## Permission Helper Tests

```typescript
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { useUserStore } from '../../../../src/stores/user'
import { basePermissions } from '../../../../src/helpers/base-permissions'

vi.mock('../../../../src/stores/user', () => ({
  useUserStore: vi.fn(),
}))

const createMockAbilityCan = (returnValue: boolean | ((action: string, level: string) => boolean)) =>
  typeof returnValue === 'function'
    ? vi.fn().mockImplementation(returnValue)
    : vi.fn().mockReturnValue(returnValue)

const setupMocks = (abilityCan: ReturnType<typeof createMockAbilityCan>) => {
  vi.mocked(useUserStore).mockReturnValue({ abilityCan } as any)
}

describe('basePermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns canCreate true when abilityCan returns true', () => {
    setupMocks(createMockAbilityCan(true))
    const result = basePermissions({ entityName: 'products', config: {} })
    expect(result.canCreate).toBe(true)
  })
})
```

---

## ViewGenerator Tests

ViewGenerator tests follow the standard component pattern but focus on schema-driven rendering. Use `setMountComponent` directly, mock only the specific view schema, and assert rendered field presence via `data-test-id`.

---

## FieldGenerator Tests (`tests/unit/templates/FieldGenerator/`)

Each of the 20 field types has its own spec. All use shared-tests helpers. When writing tests for a new field type:
1. Import the appropriate shared-test helper (e.g. `text-input-fields.ts` for text fields)
2. Use `createDefaultProps` factory with `keyName` and `modelValue`
3. Test: default render, disabled state, emit, placeholder, maxLength (where applicable)

### TableField factory

```typescript
import { TableField, ListFieldType } from '../../../../src/@model/templates/tableFields'

const fields = [
  new TableField({ key: 'name', title: 'Name Column' }),
  new TableField({ key: 'status', title: 'Status', type: ListFieldType.PillStatus }),
]
```
