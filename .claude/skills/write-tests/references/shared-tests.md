# Shared Test Utilities — Full Reference

All files live in `tests/unit/templates/shared-tests/`. Import and reuse these instead of duplicating assertion logic.

---

## modal.ts

```typescript
import {
  showModal,
  callActionShowForInternalBaseModal,
  isEqualModalTitle,
  isEqualModalDescription,
} from '../../templates/shared-tests/modal'

await showModal(wrapper)                          // calls wrapper.vm.show() + nextTick
await callActionShowForInternalBaseModal(wrapper) // finds nested BaseModal and shows it
isEqualModalTitle(wrapper, 'Confirm Delete')
isEqualModalDescription(wrapper, 'This action is irreversible')
```

---

## text-input-fields.ts

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

---

## date-and-dateTimeField.ts

Provides `testingDate` constant and `getTestCases(formatMethod)` that returns standard test cases:
- Undefined → renders `-`
- Valid date string/object → formats correctly
- Invalid date → renders `Invalid Date`

---

## Other shared test files

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
