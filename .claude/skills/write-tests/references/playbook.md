# write-tests — Playbook (Worker Reference)

Complete instruction set for the write-tests worker agent. Read this file first; read individual
reference files only when a specific edge case demands it.

---

## Where specs live

Mirror the source tree: `src/<path>` → `tests/unit/<path>`. Spec files use `.spec.ts` suffix.
Reusable mocks → `tests/unit/mocks/`. Shared helpers (not specs) → `tests/unit/templates/shared-tests/`.

---

## File structure

```typescript
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { cloneDeep } from 'lodash'

// 1. Static mocks FIRST (Vitest hoists vi.mock calls)
import '../../mocks/my-feature/static-mock'

// 2. Component / helper under test
import MyComponent from '../../../../src/components/MyComponent.vue'

// 3. Test utilities
import { setMountComponent, getSelectorTestId, findByTestId, clickTrigger, setValue } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'

// 4. Mock data / provide config
import { mockModal } from '../../mocks/modal-provide-config'

// 5. Mount function factory
const getMountMyComponent = setMountComponent(MyComponent)

// 6. Default props factory — NEVER hardcode props per it()
const createDefaultProps = (overrides = {}) => ({
  modelValue: '',
  ...overrides,
})

const global = {
  provide: { modal: mockModal },
}

describe('MyComponent.vue', () => {
  let props

  beforeEach(() => {
    props = createDefaultProps()     // use cloneDeep if props contain nested objects
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = getMountMyComponent(props, global)
    testOn.existElement({ wrapper, testId: 'my-component-root' })
  })
})
```

---

## Mount helpers (`tests/unit/utils.ts`)

```typescript
// Bind a component once; call the factory in each test
const getMountMyComponent = setMountComponent(MyComponent)
const wrapper = getMountMyComponent(props, global?, slots?)

// When global config is always identical across all tests
const getMountMyComponent = setMountComponentWithGlobal(MyComponent, { provide: { modal: mockModal } })
const wrapper = getMountMyComponent(props, slots?)
```

DOM helpers:
```typescript
getSelectorTestId('btn-submit')                    // '[data-test-id="btn-submit"]'
findByTestId(wrapper, 'btn-submit')                // single element
findByTestId(wrapper, 'list-item', { all: true })  // all matching
getWrapperElement({ wrapper, testId: 'label' })
await clickTrigger({ wrapper, testId: 'btn-submit' })
await setValue(inputWrapper, 'new value')
```

---

## testOn assertion API

**For DOM/wrapper assertions always use `testOn`** — never reach into the wrapper manually with
`wrapper.find(...).text()` etc. For non-DOM assertions (spy calls, function return values, store
state, plain objects) use raw `expect()` directly — that is the correct tool.

If a DOM assertion you need is not covered by `testOn`, check `testOn.isEqual` and
`testOn.checkExistCalledMethodWithArguments` first. If neither fits, fall back to standard
`expect(wrapper.find(...))` — do not invent a workaround or skip the assertion.

```typescript
import { testOn } from '../../templates/shared-tests/test-case-generator'
```

First argument is always `{ wrapper, testId?, selector? }`.

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
testOn.isCalledEmittedEvent({ wrapper })                                   // update:modelValue emitted
testOn.isNotCalledEmittedEvent({ wrapper })
testOn.isEqualEmittedValue({ wrapper }, [['expected value']])
testOn.isCalledEmitEventHide({ wrapper })
testOn.isCalledEmitEvent({ wrapper }, 'my-event')
testOn.isCalledEmitEventValue({ wrapper }, { event: 'my-event', value: { id: 1 }, index: 0 })
testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'my-event', value: 'exact' })
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

### Styles & generic
```typescript
testOn.isEqualAttributeStyle({ wrapper, testId: 'box' }, 'color: red;')
testOn.includePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
testOn.notIncludePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
testOn.isEqual({ wrapper, testId: 'count' }, expectedValue)
testOn.checkLengthElements({ wrapper, selector: 'li', all: true }, 5)
testOn.checkExistCalledMethodWithArguments({ wrapper: mockFn }, expectedArg)
testOn.checkNotExistCalledMethod({ wrapper: mockFn })
```

---

## Mock patterns

### 1. Simple module mock
```typescript
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
    useRoute: vi.fn(() => ({ params: {}, name: 'TestRoute', query: { page: '1' } })),
  }
})
```

### 2. Static mock file
Create `tests/unit/mocks/<feature>/static-mock.ts` with only `vi.mock()` calls; import it as the **first** import in the spec.

```typescript
// tests/unit/mocks/my-feature/static-mock.ts
import { vi } from 'vitest'
vi.mock('../../../../src/stores/user', () => ({
  useUserStore: () => ({ getSelectedProject: { id: 'p1', name: 'Project A' } }),
}))
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

### 4. Spy
```typescript
const modalSpy = vi.spyOn(mockModal, 'showModal')
expect(modalSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'confirm-modal' }))
```

### 5. Mock resolved value per test
```typescript
mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [{ id: 1 }], total: 1 })
```

### 6. mockModal provide
```typescript
import { mockModal } from '../../mocks/modal-provide-config'
const global = { provide: { modal: mockModal } }
```
`mockModal` exposes: `showModal`, `hideModal`, `registerModal`, `unregisterModal`, `modals`.

### 7. vi.hoisted() — configurable mock reference

Use when you need to reconfigure a mock in `beforeEach` or per test. Without `vi.hoisted()` the
variable is `undefined` at the time `vi.mock()` runs.

```typescript
const mockUseUserStore = vi.hoisted(() => vi.fn())

vi.mock('../../../../src/stores/user', () => ({
  useUserStore: mockUseUserStore,
}))

beforeEach(() => {
  mockUseUserStore.mockReturnValue({
    getSelectedProject: { mainLocale: 'en', locales: ['en', 'uk'] },
  })
})
```

### 8. Rejected promise (error state)

```typescript
const mockCallback = vi.fn().mockRejectedValue(new Error('Upload failed'))
// ...mount and trigger...
await flushPromises()
testOn.notExistElement({ wrapper, testId: 'loading-state' })
```

### 9. Global stubs (for Vuetify or complex child components)

Define once at module level; pass in every mount call.

```typescript
const globalConfig = {
  provide: { modal: mockModal },
  stubs: {
    VProgressCircular: { template: '<div class="v-progress-circular-stub" />' },
    VBtn: {
      props: ['disabled'],
      emits: ['click'],
      template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    },
  },
}
const getMountMyComponent = (props, slots?) => setMountComponent(MyComponent)(props, globalConfig, slots)
```

### 10. Pinia per-test initialization

Use when a test needs a real (non-mocked) store instance rather than a vi.mock stub.

```typescript
import { setActivePinia, createPinia } from 'pinia'

it('reads real store state', () => {
  setActivePinia(createPinia())
  // ...
})
```

---

## Async rules

- Component makes API calls on mount → `await flushPromises()` after mounting.
- After user interaction → `await nextTick()`, or `flushPromises()` if async work follows.
- `mockResolvedValueOnce` for a single-call override; `mockResolvedValue` for permanent override.
- For loading states: do NOT await the pending callback — let it hang, then assert loading UI.

```typescript
let resolveUpload: () => void
const pending = vi.fn(() => new Promise<void>(r => { resolveUpload = r }))
mount(MyComponent, { props: { onSubmit: pending } })
// do NOT await:
clickTrigger({ wrapper, testId: 'submit-btn' })
await nextTick()
testOn.existElement({ wrapper, testId: 'loading-indicator' })
resolveUpload()
await nextTick()
testOn.notExistElement({ wrapper, testId: 'loading-indicator' })
```

### Debounced / timer-driven logic

```typescript
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.runAllTimers(); vi.useRealTimers() })

it('debounces search', async () => {
  await setValue(inputWrapper, 'query')
  expect(wrapper.emitted('on-search')).toBeFalsy()
  vi.advanceTimersByTime(500)
  expect(wrapper.emitted('on-search')).toBeTruthy()
})
```

---

## Testing composables

Wrap the composable in a minimal test component; expose reactive values on `wrapper.vm`.

```typescript
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useMyComposable } from '../../../../src/composables/useMyComposable'

function mountComposable(opts: { isEnabled?: Ref<boolean> } = {}) {
  const { isEnabled = ref(true) } = opts

  const TestComponent = defineComponent({
    setup() {
      const { result } = useMyComposable(() => isEnabled.value)
      return { result }
    },
    template: '<div />',
  })

  return { wrapper: mount(TestComponent), isEnabled }
}

it('reacts to isEnabled change', async () => {
  const { wrapper, isEnabled } = mountComposable()
  expect(wrapper.vm.result).toBe(true)

  isEnabled.value = false
  await nextTick()

  expect(wrapper.vm.result).toBe(false)
})
```

Use `wrapper.vm.methodName()` to invoke composable methods and `wrapper.vm.propName` to read
reactive state. Cast to `any` when TypeScript refuses access to internal properties.

---

## Testing pure TS classes and helpers

No mounting needed. Create a factory function with defaults; override per test.

```typescript
const createField = (overrides: Partial<TextBaseFieldConfig> = {}) =>
  new TextBaseField({ key: 'test-key', label: 'Label', ...overrides })

describe('TextBaseField', () => {
  it('defaults id to key', () => {
    expect(createField().id).toBe('test-key')
  })

  it('applies serialize on set', () => {
    const field = createField({ serialize: (v: string) => v.toUpperCase() })
    field.value = 'hello'
    expect(field.value).toBe('HELLO')
  })
})
```

Use raw `expect()` throughout — no wrapper, no testOn.

---

## Testing watchers

```typescript
it('reacts to projectLocales change', async () => {
  const project = reactive({ locales: ['en'] })
  mockUseUserStore.mockReturnValue({ getSelectedProject: project })

  const form = makeForm()
  mount(MyComponent, { props: { form } })

  expect(form.data.de).toBeUndefined()

  project.locales = ['en', 'de']
  await nextTick()

  expect(form.data.de).toBeDefined()
})
```

---

## Slots

Pass slots as the third argument to the mount factory. Assert by selector.

```typescript
const wrapper = getMountMyComponent(props, global, {
  'modal-header': '<div class="custom-header">Title</div>',
  default: '<p data-test-id="slot-body">Content</p>',
})

testOn.existElement({ wrapper, selector: '.custom-header' })
testOn.existElement({ wrapper, testId: 'slot-body' })
```

---

## Mid-test prop updates

```typescript
props.disabled = true
await wrapper.setProps(props)
testOn.isDisabledElement({ wrapper, selector: 'input' })
```

---

## Mocking global APIs

```typescript
beforeEach(() => {
  vi.stubGlobal('CSS', { supports: () => true })
})

afterEach(() => {
  vi.unstubAllGlobals()
})
```

---

## Selector convention

**Always use `data-test-id` attributes.** Never use CSS class selectors.

```typescript
// Correct
testOn.existElement({ wrapper, testId: 'submit-btn' })
await clickTrigger({ wrapper, testId: 'submit-btn' })

// Wrong
wrapper.find('.submit-button')
```

Add `data-test-id` to source components only when:
1. The element cannot be reached via a parent `data-test-id` + scoped selector.
2. No stable native selector exists within the component scope.
3. The test genuinely needs to interact with that specific element.

Never add preemptively. Name: kebab-case, role-based (`submit-btn` not `red-btn`), unique within component.

---

## Globals provided by `vitest.setup.ts` (no import needed)

`vuetify`, `i18n`, `pinia`, `ResizeObserver` stub, `IntersectionObserver` stub.

---

## Shared test helpers (optional reads)

Use these before writing duplicate assertion logic:

| Helper file | Covers |
|---|---|
| `templates/shared-tests/modal.ts` | `showModal`, `callActionShowForInternalBaseModal`, `isEqualModalTitle/Description` |
| `templates/shared-tests/text-input-fields.ts` | `testOnValidPlaceholder`, `testOnCalledEmittedEvent`, `getPropsWithDisabledTrue`, `onDisabledInput` |
| `templates/shared-tests/date-and-dateTimeField.ts` | `testingDate`, standard date test cases |
| `templates/shared-tests/checkbox-field.ts` | Checkbox checked/unchecked + emit |
| `templates/shared-tests/select-field.ts` | Select value and options |

---

## Advanced: BaseList tests

Use the dedicated mock infrastructure — do not mock BaseList's internals manually.

```typescript
import '../../../mocks/base-list/static-mock'   // MUST be first import
import {
  getMountComponent, defaultProps, global,
  mockBaseStoreCore, exportDataMock, getSelectorCField,
} from '../../../mocks/base-list/utils'

describe('DefaultBaseList.vue', () => {
  let props

  beforeEach(() => {
    exportDataMock()
    props = cloneDeep(defaultProps)
  })

  afterEach(() => { vi.clearAllMocks() })

  it('renders fetched items', async () => {
    const wrapper = getMountComponent(props, global)
    await flushPromises()
    testOn.equalTextValue({ wrapper, selector: getSelectorCField('name') }, 'Item 1')
  })
})
```

---

## Do / Don't

### Do
- Import `static-mock.ts` as the **first import** in any spec that needs store mocks.
- Use `cloneDeep(defaultProps)` in `beforeEach` for nested objects.
- Call `vi.clearAllMocks()` in `afterEach`.
- Use `testOn.*` for all element and event assertions.
- Use `data-test-id` for all selectors.
- Mock only what the component actually depends on.

### Don't
- Don't write raw `expect(wrapper.find('.class').text()).toBe(...)` — use `testOn` for DOM assertions.
- Don't use CSS classes as selectors.
- Don't share mutable props across tests without `cloneDeep`.
- Don't use inline `vi.fn()` in provide config — use the shared `mockModal`.
- Don't put `vi.mock()` calls in the middle of a file.
- Don't test implementation details; test behaviour.
- Don't create new shared-test utilities unless the pattern appears in 3+ spec files.