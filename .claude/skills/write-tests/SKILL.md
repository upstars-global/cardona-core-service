# Skill: Write Tests

## Purpose

This skill guides writing unit tests for the `cardona-core-service` project. Follow every rule here — the codebase has a well-defined testing architecture, and deviating from it creates inconsistency.

## Trigger

Use this skill when the user asks to:
- Write tests for a component, helper, composable, or store
- Create new spec files

---

## Stack

| Tool | Version | Role |
|------|---------|------|
| Vitest | 2.0.5 | Test runner |
| @vue/test-utils | 2.4.6 | Vue component mounting |
| @testing-library/vue | 8.1.0 | Additional testing utilities |
| jsdom | 25.0.1 | DOM simulation |
| msw | 1.3.2 | API mocking (Mock Service Worker) |

Global setup file: `vitest.setup.ts`
Global plugins loaded for every test: **vuetify**, **i18n** (via `getI18n()`), **pinia**

---

## Directory Layout

```
tests/
├── __mocks__/                          # Auto-mocked node_modules (e.g. tus-js-client)
└── unit/
    ├── utils.ts                        # Core mount & DOM helpers
    ├── mocks/                          # Reusable mock objects & static vi.mock() files
    │   ├── base-list/
    │   │   ├── utils.ts                # Store mocks, mount helpers, factories for BaseList
    │   │   └── static-mock.ts         # Top-level vi.mock() calls (router, stores, toasts)
    │   ├── modal-provide-config.ts     # mockModal provide object
    │   └── permission-keys.ts         # Permission locale key fixtures
    ├── components/                     # Spec files mirroring src/components/
    │   └── templates/
    │       └── BaseList/
    │           ├── *.spec.ts
    │           └── _components/        # Sub-component specs
    ├── helpers/                        # Spec files for src/helpers/
    ├── templates/
    │   ├── FieldGenerator/             # 20 field-type specs
    │   ├── _components/                # Shared component specs
    │   └── shared-tests/              # Reusable test utilities (NOT spec files)
    │       ├── test-case-generator.ts  # Core assertion API (testOn)
    │       ├── modal.ts
    │       ├── text-input-fields.ts
    │       ├── date-and-dateTimeField.ts
    │       ├── checkbox-field.ts
    │       ├── select-field.ts
    │       ├── number-field.ts
    │       ├── status-field.ts
    │       ├── image-field.ts
    │       ├── rates.ts
    │       ├── locales.ts
    │       ├── permission-table.ts
    │       ├── copy-and-shortValue.ts
    │       ├── sum-and-currency.ts
    │       └── name-with-short-id.ts
    └── ViewGenerator/                  # ViewGenerator-specific specs
```

**Rule:** Place spec files in the same hierarchy under `tests/unit/` as the source file lives under `src/`.

---

## Core Test Utilities — `tests/unit/utils.ts`

Import from this file first in any spec.

```typescript
import {
  setMountComponent,
  setMountComponentWithGlobal,
  getSelectorTestId,
  getWrapperElement,
  findByTestId,
  clickTrigger,
  setValue,
  getConfig,
} from '../../utils'
```

### Mount helpers

```typescript
// Generic factory: returns a mount function bound to a component
const getMountMyComponent = setMountComponent(MyComponent)
// Usage:
const wrapper = getMountMyComponent(props, global?, slots?)

// When global config is always the same (e.g. always needs modal provide)
const getMountMyComponent = setMountComponentWithGlobal(MyComponent, { provide: { modal: mockModal } })
// Usage:
const wrapper = getMountMyComponent(props, slots?)
```

### DOM helpers

```typescript
// Build a [data-test-id="..."] selector string
getSelectorTestId('btn-submit')  // → '[data-test-id="btn-submit"]'

// Find element(s) by data-test-id
findByTestId(wrapper, 'btn-submit')               // single element
findByTestId(wrapper, 'list-item', { all: true }) // all matching elements

// Generic element getter — testId takes priority over selector
getWrapperElement({ wrapper, testId: 'label' })
getWrapperElement({ wrapper, selector: 'input' })
getWrapperElement({ wrapper, selector: 'li', all: true })

// Trigger a click
await clickTrigger({ wrapper, testId: 'btn-submit' })
await clickTrigger({ wrapper, selector: '.some-class' })

// Set input value
await setValue(inputWrapper, 'new value')
```

---

## The `testOn` Assertion API

**Never use raw `expect(wrapper.find(...).text()).toBe(...)` patterns.** Always use `testOn`.

```typescript
import { testOn } from '../../templates/shared-tests/test-case-generator'
```

The first argument is always a `GetWrapperElementPrams` object: `{ wrapper, testId?, selector? }`.

### Text

```typescript
testOn.equalTextValue({ wrapper, testId: 'title' }, 'Expected text')
testOn.existTextValue({ wrapper, testId: 'desc' }, 'partial match')
testOn.notExistTextValue({ wrapper, testId: 'error' }, 'should not contain')
testOn.notExistText({ wrapper, testId: 'placeholder' })   // text is falsy
```

### Element existence

```typescript
testOn.existElement({ wrapper, testId: 'save-btn' })
testOn.notExistElement({ wrapper, testId: 'delete-btn' })
```

### CSS classes

```typescript
testOn.existClass({ wrapper, testId: 'card' }, 'active')
testOn.notExistClasses({ wrapper, testId: 'card' }, 'disabled')
testOn.existClassList({ wrapper, testId: 'card' }, ['active', 'highlighted'])
```

### Events / emits

```typescript
// update:modelValue emitted at all
testOn.isCalledEmittedEvent({ wrapper })
testOn.isNotCalledEmittedEvent({ wrapper })

// update:modelValue emitted with specific value
testOn.isEqualEmittedValue({ wrapper }, [['expected value']])

// hide event emitted
testOn.isCalledEmitEventHide({ wrapper })

// Any named event emitted
testOn.isCalledEmitEvent({ wrapper }, 'my-event')

// Named event emitted with value (deep include)
testOn.isCalledEmitEventValue({ wrapper }, { event: 'my-event', value: { id: 1 }, index: 0 })

// Named event emitted with exact value (toBe)
testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'my-event', value: 'exact' })

// Named event emitted with deep equality
testOn.isCalledEmitEventValueToEqualDeep({ wrapper }, { event: 'my-event', value: { id: 1 } })
```

### Form inputs

```typescript
testOn.isDisabledElement({ wrapper, selector: 'input' })
testOn.isNotDisabledElement({ wrapper, selector: 'input' })
testOn.isEqualPlaceholder({ wrapper }, 'Enter name...')
testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, 'current value')
testOn.maxLengthAttributeToBe({ wrapper, selector: 'input' }, '100')
testOn.inputTypeToBe({ wrapper, selector: 'input' }, 'password')
testOn.checkedElementToBe({ wrapper, selector: 'input[type="checkbox"]' }, true)
```

### Styles

```typescript
testOn.isEqualAttributeStyle({ wrapper, testId: 'box' }, 'color: red;')
testOn.includePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
testOn.notIncludePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
```

### Generic equality & length

```typescript
testOn.isEqual({ wrapper, testId: 'count' }, expectedValue)
testOn.checkLengthElements({ wrapper, selector: 'li', all: true }, 5)
```

### Spy / function call assertions

```typescript
testOn.checkExistCalledMethodWithArguments({ wrapper: mockFn }, expectedArg)
testOn.checkNotExistCalledMethod({ wrapper: mockFn })
```

---

## Mock Patterns

### 1. Simple module mock

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

### 2. Static mock file (for complex components with many dependencies)

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

### 3. Pinia store mock

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

### 4. Spy — track without full mock

```typescript
import { mockModal } from '../../mocks/modal-provide-config'

const modalSpy = vi.spyOn(mockModal, 'showModal')

// After action:
expect(modalSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'confirm-modal' }))
```

### 5. Mock resolved value per test

```typescript
mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
  list: [{ id: 1, name: 'Override Item' }],
  total: 1,
})
```

### 6. mockModal provide (for components using modal injection)

```typescript
import { mockModal } from '../../mocks/modal-provide-config'

const global = {
  provide: { modal: mockModal },
}
```

`mockModal` exposes: `showModal`, `hideModal`, `registerModal`, `unregisterModal`, `modals`.

---

## Selector Convention

**Always use `data-test-id` attributes.** Never use CSS class selectors in tests.

```typescript
// Correct
testOn.existElement({ wrapper, testId: 'submit-btn' })
await clickTrigger({ wrapper, testId: 'submit-btn' })

// Incorrect — do not do this
wrapper.find('.submit-button')
wrapper.find('.v-btn--primary')
```

For table cell assertions in BaseList-style tests:
```typescript
const getSelectorCField = (name: string) => `td[data-c-field="${name}"]`

testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
```

---

## Adding `data-test-id` to Source Components

When writing tests you may need to reference an element that has no `data-test-id` yet. Add one to the source component **only when necessary** — do not add `data-test-id` preemptively to every element.

### When to add

Add `data-test-id` when **all** of the following are true:
1. The element cannot be reliably targeted by an existing `data-test-id` on a parent or sibling
2. There is no semantic HTML selector that is stable enough (e.g. the only `input` inside the component)
3. The test genuinely needs to interact with or assert on that specific element

### When NOT to add

- The element is already reachable via a parent `data-test-id` + scoped selector
- The element can be targeted by a stable native selector within the component scope (`input`, `textarea`, `select`, `button` when there is only one)
- The element is purely decorative and no test logic depends on it

### How to add

```vue
<!-- Before: no test hook -->
<button @click="submit">Save</button>

<!-- After: minimal, descriptive id -->
<button data-test-id="submit-btn" @click="submit">Save</button>
```

Naming rules:
- Use kebab-case: `submit-btn`, `modal-title`, `list-item`
- Be descriptive of the element's role, not its appearance: `delete-btn` not `red-btn`
- Keep it unique within the component's template
- Do not add an index suffix unless the element is genuinely repeated: `list-item` not `list-item-1`

### Repeated elements

For lists, add `data-test-id` once on the repeating element — tests can then use `{ all: true }` or target by index:

```vue
<li
  v-for="item in items"
  :key="item.id"
  data-test-id="list-item"
>
```

```typescript
// Get all items
const items = findByTestId(wrapper, 'list-item', { all: true })
testOn.checkLengthElements({ wrapper, testId: 'list-item', all: true }, 3)
```

---

## Data Factory Pattern

Always use a `createDefaultProps` factory with override support. Never hardcode props in every `it` block.

```typescript
const createDefaultProps = (overrides: Partial<MyComponentProps> = {}): MyComponentProps => ({
  modelValue: '',
  label: 'Default Label',
  disabled: false,
  ...overrides,
})
```

For `TableField` arrays:
```typescript
import { TableField, ListFieldType } from '../../../../src/@model/templates/tableFields'

const fields = [
  new TableField({ key: 'name', title: 'Name Column' }),
  new TableField({ key: 'status', title: 'Status', type: ListFieldType.PillStatus }),
]
```

---

## Test File Structure

```typescript
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { cloneDeep } from 'lodash'

// 1. Static mocks FIRST (if needed)
import '../../mocks/my-feature/static-mock'

// 2. Component under test
import MyComponent from '../../../../src/components/MyComponent.vue'

// 3. Test utilities
import { setMountComponent, getSelectorTestId } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'

// 4. Mock data / provide config
import { mockModal } from '../../mocks/modal-provide-config'

// 5. Mount function factory
const getMountMyComponent = setMountComponent(MyComponent)

// 6. Default props factory
const createDefaultProps = (overrides = {}) => ({
  modelValue: '',
  ...overrides,
})

const global = {
  provide: { modal: mockModal },
}

// 7. Tests
describe('MyComponent.vue', () => {
  let props

  beforeEach(() => {
    props = createDefaultProps()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = getMountMyComponent(props, global)
    testOn.existElement({ wrapper, testId: 'my-component-root' })
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = getMountMyComponent(props, global)

    testOn.isNotCalledEmittedEvent({ wrapper })

    await wrapper.find('input').setValue('new value')

    testOn.isCalledEmittedEvent({ wrapper })
    testOn.isEqualEmittedValue({ wrapper }, [['new value']])
  })
})
```

---

## Async Testing Rules

- After mounting a component that makes API calls on mount, always `await flushPromises()`.
- After user interactions (click, setValue), always `await nextTick()` or `await flushPromises()` if async operations follow.
- Use `mockResolvedValueOnce` for single-call overrides; `mockResolvedValue` for permanent overrides.

```typescript
it('loads data on mount', async () => {
  const wrapper = getMountMyComponent(props, global)
  await flushPromises()    // wait for all async store calls

  testOn.equalTextValue({ wrapper, testId: 'item-name' }, 'Item 1')
})
```

---

## Shared Test Utilities — `tests/unit/templates/shared-tests/`

Reuse these instead of duplicating assertion logic.

### modal.ts

```typescript
import { showModal, callActionShowForInternalBaseModal, isEqualModalTitle, isEqualModalDescription } from '../../templates/shared-tests/modal'

await showModal(wrapper)                          // calls wrapper.vm.show() + nextTick
await callActionShowForInternalBaseModal(wrapper) // finds nested BaseModal and shows it
isEqualModalTitle(wrapper, 'Confirm Delete')
isEqualModalDescription(wrapper, 'This action is irreversible')
```

### text-input-fields.ts

```typescript
import {
  testOnValidPlaceholder,
  getPropsWithDisabledTrue,
  testOnCalledEmittedEvent,
  onDisabledInput,
} from '../../templates/shared-tests/text-input-fields'

testOnValidPlaceholder(wrapper, 'Enter your name')
await testOnCalledEmittedEvent({ wrapper, selector: 'input' }, 'typed value')
onDisabledInput({ wrapper, selector: 'input' })

const disabledProps = getPropsWithDisabledTrue(props)
```

### date-and-dateTimeField.ts

Provides `testingDate` constant and `getTestCases(formatMethod)` that returns standard test cases:
- Undefined → renders `-`
- Valid date string/object → formats correctly
- Invalid date → renders `Invalid Date`

### Other shared test files

| File | What it tests |
|------|--------------|
| `checkbox-field.ts` | Checkbox checked/unchecked state and emit |
| `select-field.ts` | Select value, options rendering |
| `number-field.ts` | Numeric input constraints and emit |
| `status-field.ts` | Status badge rendering |
| `image-field.ts` | Image src and fallback |
| `rates.ts` | Rating display |
| `locales.ts` | Locale tab switching and content |
| `permission-table.ts` | Permission grid rendering |
| `copy-and-shortValue.ts` | Copy-to-clipboard trigger |
| `sum-and-currency.ts` | Currency formatted output |
| `name-with-short-id.ts` | Name + truncated ID display |

---

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

---

## Do / Don't

### Do

- Import `static-mock.ts` as the **first import** in any spec that needs store mocks
- Use `cloneDeep(defaultProps)` in `beforeEach` to prevent state leakage between tests
- Call `vi.clearAllMocks()` in `afterEach`
- Use `testOn.*` for all element and event assertions
- Use `data-test-id` for all selectors
- Use `await flushPromises()` after any component that fetches data on mount
- Mock only what the component actually depends on — don't over-mock

### Don't

- Don't write raw `expect(wrapper.find('.class').text()).toBe(...)` — use `testOn`
- Don't use CSS classes as selectors
- Don't share mutable `props` across tests without `cloneDeep`
- Don't use `vi.fn()` inline in provide config — use the shared `mockModal` from `mocks/modal-provide-config.ts`
- Don't add `vi.mock()` calls in the middle of a file — they are hoisted to the top by Vitest, which causes confusion; keep them at the top or in a dedicated static-mock file
- Don't test implementation details; test behaviour (what the user/consumer sees)
- Don't create new shared-test utilities unless the pattern appears in 3+ spec files

---

## vitest.setup.ts — What is globally available

These are available in every test without explicit import or mock:

| Global | Source |
|--------|--------|
| `vuetify` plugin | `vitest.setup.ts` |
| `i18n` plugin | `vitest.setup.ts` |
| `pinia` plugin | `vitest.setup.ts` |
| CSS/SCSS imports mocked | `vi.mock('*.css')` |
| `ResizeObserver` stub | `vitest.setup.ts` |
| `IntersectionObserver` stub | `vitest.setup.ts` |
| `tus-js-client` mocked | `vi.mock('tus-js-client')` |
| `clipboard` helper mocked | `vi.mock('./src/helpers/clipboard')` |

You do **not** need to add these to your test's `global` config.

---

## Quick Reference — Imports Cheat Sheet

```typescript
// Core mounting
import { setMountComponent, setMountComponentWithGlobal, getSelectorTestId, findByTestId, getWrapperElement, clickTrigger, setValue } from '../../utils'

// Assertion API
import { testOn, testCaseGenerator, WrapperProperties, EventEmittersNames, InputAttributes, ExpectMethods } from '../../templates/shared-tests/test-case-generator'

// Modal provide
import { mockModal } from '../../mocks/modal-provide-config'

// BaseList infrastructure
import '../../mocks/base-list/static-mock'
import { getMountComponent, defaultProps, global, mockBaseStoreCore, exportDataMock, getSelectorCField } from '../../mocks/base-list/utils'

// Shared field test helpers
import { testOnCalledEmittedEvent, getPropsWithDisabledTrue } from '../../templates/shared-tests/text-input-fields'
import { showModal, isEqualModalTitle } from '../../templates/shared-tests/modal'

// Vitest
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'
import { flushPromises, nextTick } from '@vue/test-utils'
import { cloneDeep } from 'lodash'
```
