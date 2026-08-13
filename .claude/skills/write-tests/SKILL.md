---
name: write-tests
description: Write Vitest unit tests for the cardona-core-service project. Use whenever asked to write, add or fix unit tests, create a spec file, or cover a component/helper/composable/store. Also on "test this", "add coverage for". Not for implementing features, fixing bugs or explaining code.
---

# Skill: Write Tests

## Where specs live

Mirror the source tree: a spec for `src/<path>` goes to `tests/unit/<path>`. Reusable mocks live in
`tests/unit/mocks/`, shared helpers in `tests/unit/templates/shared-tests/` (helpers, not specs).
Read `references/toolbox.md` if you need the full tree or the stack versions.

Runner: Vitest + jsdom. `vitest.setup.ts` loads **vuetify**, **i18n** and **pinia** globally for every
test — don't re-register them.

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
const wrapper = getMountMyComponent(props, global?, slots?)

// When global config is always the same (e.g. always needs modal provide)
const getMountMyComponent = setMountComponentWithGlobal(MyComponent, { provide: { modal: mockModal } })
const wrapper = getMountMyComponent(props, slots?)
```

### DOM helpers

```typescript
getSelectorTestId('btn-submit')                              // → '[data-test-id="btn-submit"]'
findByTestId(wrapper, 'btn-submit')                          // single element
findByTestId(wrapper, 'list-item', { all: true })            // all matching elements
getWrapperElement({ wrapper, testId: 'label' })
await clickTrigger({ wrapper, testId: 'btn-submit' })
await setValue(inputWrapper, 'new value')
```

---

## The `testOn` Assertion API

**Never use raw `expect(wrapper.find(...).text()).toBe(...)` patterns.** Always use `testOn`.

```typescript
import { testOn } from '../../templates/shared-tests/test-case-generator'
```

The first argument is always `{ wrapper, testId?, selector? }`.

**Common assertions:**
```typescript
testOn.equalTextValue({ wrapper, testId: 'title' }, 'Expected text')
testOn.existElement({ wrapper, testId: 'save-btn' })
testOn.notExistElement({ wrapper, testId: 'delete-btn' })
testOn.existClass({ wrapper, testId: 'card' }, 'active')
testOn.isCalledEmittedEvent({ wrapper })
testOn.isEqualEmittedValue({ wrapper }, [['expected value']])
testOn.isCalledEmitEvent({ wrapper }, 'my-event')
testOn.isDisabledElement({ wrapper, selector: 'input' })
testOn.checkLengthElements({ wrapper, selector: 'li', all: true }, 5)
```

For the full testOn API (all text, class, event, form, style, spy assertions), see `references/testOn-api.md`.

---

## Mock Patterns

Six mock patterns are used in this project:

1. **Simple module mock** — `vi.mock('vue-router', ...)`
2. **Static mock file** — separate `static-mock.ts` imported first in spec
3. **Pinia store mock** — `vi.mock('...stores/baseStoreCore', ...)`
4. **Spy** — `vi.spyOn(mockModal, 'showModal')`
5. **Mock resolved value per test** — `mockFn.mockResolvedValueOnce(...)`
6. **mockModal provide** — `{ provide: { modal: mockModal } }`

For full examples of each pattern, see `references/mock-patterns.md`.

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

## Async & data patterns (short form)

- Component fetches on mount → `await flushPromises()` after mounting.
- After a user interaction → `await nextTick()`, or `flushPromises()` if async work follows.
- Props always come from a `createDefaultProps(overrides = {})` factory, never hardcoded per `it`.
- `mockResolvedValueOnce` for a single call, `mockResolvedValue` for a permanent override.

Read `references/toolbox.md` only if you need an exact import path, the list of globals
`vitest.setup.ts` provides, or the full versions of the patterns above.

## Selector Convention

**Always use `data-test-id` attributes.** Never use CSS class selectors in tests.

```typescript
// Correct
testOn.existElement({ wrapper, testId: 'submit-btn' })
await clickTrigger({ wrapper, testId: 'submit-btn' })

// Incorrect — do not do this
wrapper.find('.submit-button')
```

### Adding `data-test-id` to source components

Add `data-test-id` only when:
1. The element can't be reached via parent `data-test-id` + scoped selector
2. No stable native selector exists within the component scope
3. The test genuinely needs to interact with that specific element

**Never add preemptively.** Naming: kebab-case, role-based (`submit-btn` not `red-btn`), unique within component.

---

## Do / Don't

### Do
- Import `static-mock.ts` as the **first import** in any spec that needs store mocks
- Use `cloneDeep(defaultProps)` in `beforeEach` to prevent state leakage
- Call `vi.clearAllMocks()` in `afterEach`
- Use `testOn.*` for all element and event assertions
- Use `data-test-id` for all selectors
- Use `await flushPromises()` after any component that fetches data on mount
- Mock only what the component actually depends on

### Don't
- Don't write raw `expect(wrapper.find('.class').text()).toBe(...)`
- Don't use CSS classes as selectors
- Don't share mutable `props` across tests without `cloneDeep`
- Don't use `vi.fn()` inline in provide config — use shared `mockModal`
- Don't put `vi.mock()` calls in the middle of a file — keep them at top or in static-mock
- Don't test implementation details; test behaviour
- Don't create new shared-test utilities unless the pattern appears in 3+ spec files

---

## Reference Files

| File | When to read |
|------|-------------|
| `references/testOn-api.md` | Full testOn assertion API with all overloads |
| `references/mock-patterns.md` | Full examples for all 6 mock patterns |
| `references/shared-tests.md` | All shared-tests helpers (modal, text inputs, date, etc.) |
| `references/toolbox.md` | Imports cheat sheet, globals, directory tree, async & data-factory patterns |
| `references/advanced-patterns.md` | BaseList, Permission helpers, ViewGenerator, FieldGenerator |

---
