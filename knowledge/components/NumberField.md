---
title: NumberField
type: component
source: src/components/templates/FieldGenerator/_components/NumberField.vue
source_hash: 3da7746237f4
tags: [field-generator]
updated: 2026-11-23
---

# NumberField

Числовой инпут (`type="number"`) для `NumberBaseField`, рендерится через `FieldGenerator`.

## Что неочевидно

- **Верхняя граница не ограничивается компонентом.** Ввод больше `max_value` не блокируется и не откатывается — значение уходит в `update:modelValue` как есть. Лимит проверяет только vee-validate по `field.validationRules.max_value` (ошибка показывается в `FieldGenerator`). Раньше компонент резал ввод сам (`useNumberMaxValue` + событие `validate`) — от этого отказались.
- **`NumberBaseField` не подставляет дефолтный `max_value`.** Без явного правила верхнего предела нет вообще; `NUMBER_FIELD_MAX_VALUE` в модель больше не попадает. Нужен лимит — задавайте `validationRules.max_value` в поле.
- **`withPositiveNumbers` / `isIntegerNumbers` — это и фильтр клавиш, и нормализация значения.** `keydown` глушит `e` (всегда), `.`/`,` (integer) и `-` (positive), а сеттер ещё раз прогоняет значение через `toPositiveNumbers` / `toIntegerNumbers` — это ловит вставку из буфера, которую `keydown` не видит.
- Колесо мыши снимает фокус с инпута (`onWheel` → `blur`), чтобы скролл страницы не менял число.

## Связанные

- [[FieldGenerator]] — владеет валидацией и показом ошибки
