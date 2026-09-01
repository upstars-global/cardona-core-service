# write-tests — Playbook (Core)

Always read this file. Read additional references only when the source file requires them — see the
table at the bottom.

---

## Where specs live

`src/<path>` → `tests/unit/<path>`, `.spec.ts` suffix. Mocks → `tests/unit/mocks/`.

---

## File structure

```typescript
// 1. Static mocks FIRST (vi.mock is hoisted)
import '../../mocks/my-feature/static-mock'

// 2. Source under test
import MyComponent from '../../../../src/components/MyComponent.vue'

// 3. Utilities
import { setMountComponent, clickTrigger, setValue } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { mockModal } from '../../mocks/modal-provide-config'

const getMountMyComponent = setMountComponent(MyComponent)

const createDefaultProps = (overrides = {}) => ({ modelValue: '', ...overrides })

const global = { provide: { modal: mockModal } }

describe('MyComponent.vue', () => {
  let props

  beforeEach(() => { props = createDefaultProps() })
  afterEach(() => { vi.clearAllMocks() })

  it('...', () => {
    const wrapper = getMountMyComponent(props, global)
    testOn.existElement({ wrapper, testId: 'root' })
  })
})
```

Use `cloneDeep(props)` in `beforeEach` when props contain nested objects.

---

## testOn — common assertions

For DOM/wrapper assertions always use `testOn`. For non-DOM (spy calls, return values, store state)
use raw `expect()` directly.

```typescript
testOn.existElement({ wrapper, testId: 'btn' })
testOn.notExistElement({ wrapper, testId: 'btn' })
testOn.equalTextValue({ wrapper, testId: 'title' }, 'Text')
testOn.existClass({ wrapper, testId: 'card' }, 'active')
testOn.isCalledEmittedEvent({ wrapper })
testOn.isEqualEmittedValue({ wrapper }, [['value']])
testOn.isCalledEmitEvent({ wrapper }, 'my-event')
testOn.isDisabledElement({ wrapper, selector: 'input' })
testOn.checkLengthElements({ wrapper, selector: 'li', all: true }, 5)
```

If a DOM assertion is not covered → check `testOn.isEqual` / `testOn.checkExistCalledMethodWithArguments`
first; if neither fits, use raw `expect(wrapper.find(...))`.
Full API → `testOn-api.md`.

---

## Mock patterns

```typescript
// 1. Simple module mock
vi.mock('vue-router', async importOriginal => ({ ...await importOriginal(), useRouter: vi.fn(() => ({ push: vi.fn() })) }))

// 2. Static mock file — import FIRST in spec
import '../../mocks/my-feature/static-mock'   // contains only vi.mock() calls

// 3. Pinia store mock
vi.mock('../../../../src/stores/baseStoreCore', () => ({ useBaseStoreCore: () => ({ fetchEntityList: vi.fn().mockResolvedValue({ list: [], total: 0 }) }) }))

// 4. Spy
const spy = vi.spyOn(mockModal, 'showModal')
expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: 'modal' }))

// 5. Per-test resolved value
mockFn.mockResolvedValueOnce({ list: [{ id: 1 }], total: 1 })

// 6. mockModal provide
const global = { provide: { modal: mockModal } }
```

Full examples with edge cases → `mock-patterns.md`.

---

## Async rules

- API call on mount → `await flushPromises()` after mounting.
- After user interaction → `await nextTick()`; use `flushPromises()` if async work follows.
- `mockResolvedValueOnce` — single call; `mockResolvedValue` — permanent.

---

## Selectors

Always `data-test-id`. Never CSS classes. Add `data-test-id` to source only when the element cannot
be reached via parent selector and the test genuinely needs it. Name: kebab-case, role-based.

---

## Do / Don't

**Do:** static-mock as first import · `cloneDeep` for nested props · `vi.clearAllMocks()` in afterEach · `testOn` for DOM · `data-test-id` for selectors · mock only what the component depends on

**Don't:** raw `expect(wrapper.find('.class').text())` · CSS class selectors · mutable shared props · inline `vi.fn()` in provide · `vi.mock()` in the middle of a file · test implementation details · new shared-test utilities for < 3 spec files

---

## When to read additional references

| If the source file has... | Read |
|---|---|
| Composables, watchers, reactive state, slots, timers, stubs, `vi.hoisted`, pure TS classes | `composables-and-classes.md` |
| BaseList, FieldGenerator, ViewGenerator, Permission helpers | `advanced-patterns.md` |
| Unfamiliar `testOn.*` method | `testOn-api.md` |
| Complex mock setup not covered above | `mock-patterns.md` |
| Unknown import path or global | `toolbox.md` |
