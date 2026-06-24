# Mock Patterns — Full Reference

## 1. Simple module mock

```typescript
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      getRoutes: vi.fn(() => [
        { name: 'TestCreate', path: '/test/create' },
      ]),
    })),
    useRoute: vi.fn(() => ({
      params: {},
      name: 'TestRoute',
      query: { page: '1' },
    })),
  }
})
```

## 2. Static mock file (for complex components with many dependencies)

Create a file like `tests/unit/mocks/<feature>/static-mock.ts` and import it as the **first import** in the spec file. It must contain only `vi.mock()` calls (Vitest hoists these).

```typescript
// tests/unit/mocks/my-feature/static-mock.ts
import { vi } from 'vitest'

vi.mock('../../../../src/stores/user', () => ({
  useUserStore: () => ({
    getSelectedProject: { id: 'p1', name: 'Project A' },
  }),
}))

vi.mock('../../../../src/helpers/toasts', () => ({
  default: vi.fn(() => ({
    toastError: vi.fn(),
    toastSuccess: vi.fn(),
  })),
}))
```

```typescript
// In your spec file — MUST be first import
import '../../../mocks/my-feature/static-mock'
```

## 3. Pinia store mock

```typescript
vi.mock('../../../../src/stores/baseStoreCore', () => ({
  useBaseStoreCore: () => ({
    fetchEntityList: vi.fn().mockResolvedValue({ list: [], total: 0 }),
    updateEntity: vi.fn(),
    deleteEntity: vi.fn(),
    isLoading: false,
    selectedItems: [],
  }),
}))
```

## 4. Spy — track without full mock

```typescript
import { mockModal } from '../../mocks/modal-provide-config'

const modalSpy = vi.spyOn(mockModal, 'showModal')

// After action:
expect(modalSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'confirm-modal' }))
```

## 5. Mock resolved value per test

```typescript
mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
  list: [{ id: 1, name: 'Override Item' }],
  total: 1,
})
```

## 6. mockModal provide (for components using modal injection)

```typescript
import { mockModal } from '../../mocks/modal-provide-config'

const global = {
  provide: { modal: mockModal },
}
```

`mockModal` exposes: `showModal`, `hideModal`, `registerModal`, `unregisterModal`, `modals`.
