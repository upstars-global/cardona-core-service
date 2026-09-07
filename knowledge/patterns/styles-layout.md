---
title: Styles Layout Architecture
type: pattern
source: src/assets/styles/layouts/STYLES_GUIDE.md
source_hash: 5dd915df11ee
tags: [scss, styles, island, default, layout]
updated: 2026-08-27
---

# Styles Layout Architecture

Трёхслойная SCSS-система: глобальная структура (`components/`), токены цветов (`styles.scss`),
layout-специфичные переопределения (`layouts/*/components/`). Задокументирована в `STYLES_GUIDE.md`;
здесь — только неочевидные инварианты.

## Что неочевидно

**Island и default загружаются по-разному.**
`styles.scss` (через `main.ts`) загружается глобально — охватывает оба layout.
Стили island дополнительно подгружаются через `<style lang="scss">` в `src/layouts/island/index.vue` →
`island/index.scss` → `island/components/index.scss`. Если правило нужно только в island,
оно должно быть внутри `@mixin apply` в соответствующем файле — иначе оно станет глобальным.

**Grey-900 — глобальный baseline, не default-specific.**
`components/vue-select.scss` устанавливает grey-900 цвета для обоих layouts.
Нельзя перемещать grey-900 в `body[data-layout="default"]` — island потеряет цвет для всех
элементов, которые surface-invert явно не переопределяет (`.vs__dropdown-option`, `.vs__actions` и др.).
Island переопределяет только то, что отличается — через surface-invert с бо́льшей специфичностью.

**Порядок `@include` в `island/components/index.scss` определяет победителя при равной специфичности.**
`project-select.apply` включается раньше `base-select.apply`. При одинаковой специфичности
правила `base-select` побеждают. Чтобы project-select мог переопределить что-то из base-select,
нужно либо поставить его позже, либо добавить специфичность (`.project-select .rule` вместо `.rule`).

**CSS var-токены определяются в `styles.scss`, а не в layout-файлах.**
Оба блока `body[data-layout="default"]` и `body[data-layout="island"]` с `--c-*` переменными
намеренно хранятся в одном файле рядом с консьюмерами (`.text-color-base { color: var(--c-text-base) }`).
Разносить их по layout-директориям не имеет смысла: консьюмеры останутся в `styles.scss`,
а добавление нового layout потребует редактирования только одного файла.

**`!important` в island-контексте.**
`body[data-layout="island"] .rule { ... !important }` побеждает над scoped Vue-стилями
(у которых `[data-v-hash]` даёт (0,4,0) специфичность), потому что `!important`
сравнивается в отдельном «!important-слое» независимо от специфичности.
Каждый `!important` обязан иметь комментарий-тег: `[forced-vuetify]`, `[forced-teleport]`,
`[forced-pseudo]`, `[forced-pseudo-element]`.

**`.select-field-color` конфликтует с выбранной опцией в dropdown.**
`island/components/project-select.scss` ставит `color: island-project-color !important`
на `.select-field-color`. Внутри `.vs__dropdown-option--selected` этот `!important`
перебивает унаследованный `color: background`. Явное переопределение обязательно:
```scss
.vs__dropdown-option--selected .select-field-color {
  color: rgb(var(--v-theme-background)) !important;
}
```

## Связанные

- [[code-conventions]] — общие code conventions проекта
