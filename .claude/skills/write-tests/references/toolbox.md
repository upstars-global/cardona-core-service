# write-tests — toolbox

Read when you need an exact import path, the globals the setup file already provides, or the
async/data patterns in full. The SKILL keeps only what every spec needs.

## Async Testing Rules

- After mounting a component that makes API calls on mount: `await flushPromises()`
- After user interactions: `await nextTick()` or `await flushPromises()` if async operations follow
- Use `mockResolvedValueOnce` for single-call overrides; `mockResolvedValue` for permanent overrides

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

---

## Quick Reference — Imports Cheat Sheet

```typescript
// Core mounting
import { setMountComponent, setMountComponentWithGlobal, getSelectorTestId, findByTestId, getWrapperElement, clickTrigger, setValue } from '../../utils'

// Assertion API
import { testOn } from '../../templates/shared-tests/test-case-generator'

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

---

## Globals Available Without Import

| Global | Source |
|--------|--------|
| `vuetify` plugin | `vitest.setup.ts` |
| `i18n` plugin | `vitest.setup.ts` |
| `pinia` plugin | `vitest.setup.ts` |
| `ResizeObserver` stub | `vitest.setup.ts` |
| `IntersectionObserver` stub | `vitest.setup.ts` |
| `tus-js-client` mocked | `vi.mock('tus-js-client')` |
| `clipboard` helper mocked | `vi.mock('./src/helpers/clipboard')` |

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
    ├── helpers/                        # Spec files for src/helpers/
    ├── templates/
    │   ├── FieldGenerator/             # 20 field-type specs
    │   ├── _components/                # Shared component specs
    │   └── shared-tests/              # Reusable test utilities (NOT spec files)
    └── ViewGenerator/                  # ViewGenerator-specific specs
```

**Rule:** Place spec files in the same hierarchy under `tests/unit/` as the source file lives under `src/`.

---
