---
title: FieldGenerator
type: component
source: src/components/templates/FieldGenerator/index.vue
source_hash: 73ddf54a66fd
tags: [field-generator, validation]
updated: 2026-11-23
---

# FieldGenerator

Обёртка над vee-validate `Field`: по `BaseField` (`modelValue`) выбирает компонент (`field.component`), рисует label, ошибку и описание.

## Что неочевидно

- **Автовалидация выключена** (`validate-on-blur/change/input = false`). Остаётся только `validate-on-model-update`, и он **отключается для не до конца введённого диапазона дат** (`notFilledDateRange`) — иначе ошибка мигает, пока выбрана только первая дата.
- **Правила не применяются к `RatesBaseField`** (`rules = {}`): его валидирует сам компонент.
- **`fieldModel` мутирует `modelValue.value` на месте** и эмитит тот же экземпляр. Класс-поля не реактивны глубоко — потребитель получает тот же объект, а не копию.
- **Смена локали перевалидирует поле только если ошибка уже показана**, чтобы текст ошибки перевёлся; чистое поле не подсвечивается.
- **Дочерний компонент может попросить валидацию событием `validate`** (`onValidate` → `nextTick` → `veeField.validate()`): vee-validate не валидирует значение, пришедшее через props. Сейчас ни один компонент (включая [[NumberField]]) это событие не эмитит.
- `canView` скрывает поле целиком, `!canUpdate` делает его `disabled` — оба по `modelValue.permission`.
- Имя валидируемого поля — `label` в нижнем регистре, кроме кодов валют (`allCurrencies`), которые остаются как есть.

## Связанные

- [[NumberField]]
