# Composables, Classes, Watchers, Slots, Timers

Read this file when the source is a composable, pure TS class/helper, or when the component uses
watchers, slots, debounced logic, global APIs, or Vuetify child stubs.

---

## Composables — test via wrapper component

```typescript
import { defineComponent, ref, type Ref } from 'vue'
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

Use `wrapper.vm.method()` to call composable methods. Cast to `any` for private properties.

---

## Pure TS classes and helpers — no mounting

```typescript
const createField = (overrides: Partial<Config> = {}) =>
  new TextBaseField({ key: 'test-key', label: 'Label', ...overrides })

it('defaults id to key', () => {
  expect(createField().id).toBe('test-key')
})

it('applies serialize on set', () => {
  const field = createField({ serialize: (v: string) => v.toUpperCase() })
  field.value = 'hello'
  expect(field.value).toBe('HELLO')
})
```

Use raw `expect()` throughout — no wrapper, no testOn.

---

## Watchers

```typescript
it('reacts to locales change', async () => {
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

```typescript
const wrapper = getMountMyComponent(props, global, {
  'modal-header': '<div class="custom-header">Title</div>',
  default: '<p data-test-id="slot-body">Content</p>',
})
testOn.existElement({ wrapper, selector: '.custom-header' })
testOn.existElement({ wrapper, testId: 'slot-body' })
```

---

## Mid-test prop update

```typescript
props.disabled = true
await wrapper.setProps(props)
testOn.isDisabledElement({ wrapper, selector: 'input' })
```

---

## vi.hoisted() — configurable mock reference

Use when you need to reconfigure the mock in `beforeEach` or per test.

```typescript
const mockUseUserStore = vi.hoisted(() => vi.fn())

vi.mock('../../../../src/stores/user', () => ({ useUserStore: mockUseUserStore }))

beforeEach(() => {
  mockUseUserStore.mockReturnValue({ getSelectedProject: { mainLocale: 'en', locales: ['en'] } })
})
```

---

## Global API mocking

```typescript
beforeEach(() => { vi.stubGlobal('CSS', { supports: () => true }) })
afterEach(() => { vi.unstubAllGlobals() })
```

---

## Vuetify child stubs

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
```

---

## Debounced / timer logic

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

## Loading state (pending promise)

```typescript
let resolveUpload: () => void
const pending = vi.fn(() => new Promise<void>(r => { resolveUpload = r }))

mount(MyComponent, { props: { onSubmit: pending } })
clickTrigger({ wrapper, testId: 'submit-btn' })  // do NOT await
await nextTick()

testOn.existElement({ wrapper, testId: 'loading-indicator' })

resolveUpload()
await nextTick()

testOn.notExistElement({ wrapper, testId: 'loading-indicator' })
```

---

## Error state (rejected promise)

```typescript
const mockFn = vi.fn().mockRejectedValue(new Error('Failed'))
// mount, trigger, await flushPromises()
testOn.notExistElement({ wrapper, testId: 'loading-indicator' })
```

---

## Pinia per-test initialization

```typescript
import { setActivePinia, createPinia } from 'pinia'

it('uses real store', () => {
  setActivePinia(createPinia())
  // ...
})
```
