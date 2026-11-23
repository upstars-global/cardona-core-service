---
title: NumberBaseField
type: model
source: src/@model/templates/baseField/number.ts
source_hash: a02527806913
tags: [field-generator, validation]
updated: 2026-11-23
---

# NumberBaseField

Модель числового поля для `FieldGenerator`; рендерится компонентом [[NumberField]].

## Что неочевидно

- **Дефолтный `max_value = NUMBER_FIELD_MAX_VALUE` добавляется в конструкторе**, если в `validationRules` его нет. «Нет» = falsy: `0`, `''`, `null` **перезаписываются дефолтом** (он идёт после спреда правил поля), так что лимит `0` выразить нельзя. Явный truthy `max_value` не трогается.
- **Конструктор мутирует переданный объект `field`** (присваивает ему новый `validationRules`), но не сам объект правил — тот, что передал вызывающий, остаётся нетронутым.
- **Дефолт теряется при `setValidationRules`** — он заменяет правила целиком. Нужен лимит после замены — передавайте `max_value` явно. `clone({ validationRules })` проходит через конструктор, поэтому дефолт возвращает.
- **Лимит проверяет только vee-validate**, не сам инпут (см. [[NumberField]]): значение выше лимита вводится, но не проходит валидацию.
- `NumberRangeBaseField` дефолтный лимит **не получает**.
