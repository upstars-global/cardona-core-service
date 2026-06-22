# testOn Assertion API — Full Reference

```typescript
import { testOn } from '../../templates/shared-tests/test-case-generator'
```

The first argument is always a `GetWrapperElementPrams` object: `{ wrapper, testId?, selector? }`.

---

## Text

```typescript
testOn.equalTextValue({ wrapper, testId: 'title' }, 'Expected text')
testOn.existTextValue({ wrapper, testId: 'desc' }, 'partial match')
testOn.notExistTextValue({ wrapper, testId: 'error' }, 'should not contain')
testOn.notExistText({ wrapper, testId: 'placeholder' })   // text is falsy
```

## Element existence

```typescript
testOn.existElement({ wrapper, testId: 'save-btn' })
testOn.notExistElement({ wrapper, testId: 'delete-btn' })
```

## CSS classes

```typescript
testOn.existClass({ wrapper, testId: 'card' }, 'active')
testOn.notExistClasses({ wrapper, testId: 'card' }, 'disabled')
testOn.existClassList({ wrapper, testId: 'card' }, ['active', 'highlighted'])
```

## Events / emits

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

## Form inputs

```typescript
testOn.isDisabledElement({ wrapper, selector: 'input' })
testOn.isNotDisabledElement({ wrapper, selector: 'input' })
testOn.isEqualPlaceholder({ wrapper }, 'Enter name...')
testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, 'current value')
testOn.maxLengthAttributeToBe({ wrapper, selector: 'input' }, '100')
testOn.inputTypeToBe({ wrapper, selector: 'input' }, 'password')
testOn.checkedElementToBe({ wrapper, selector: 'input[type="checkbox"]' }, true)
```

## Styles

```typescript
testOn.isEqualAttributeStyle({ wrapper, testId: 'box' }, 'color: red;')
testOn.includePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
testOn.notIncludePropertyStyle({ wrapper, testId: 'box' }, { color: 'red' })
```

## Generic equality & length

```typescript
testOn.isEqual({ wrapper, testId: 'count' }, expectedValue)
testOn.checkLengthElements({ wrapper, selector: 'li', all: true }, 5)
```

## Spy / function call assertions

```typescript
testOn.checkExistCalledMethodWithArguments({ wrapper: mockFn }, expectedArg)
testOn.checkNotExistCalledMethod({ wrapper: mockFn })
```
