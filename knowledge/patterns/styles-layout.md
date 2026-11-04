---
title: Styles Layout Architecture
type: pattern
source: src/assets/styles/styles.scss
source_hash: aa4c16c72367
tags: [scss, styles, default, layout]
updated: 2026-10-26
---

# Styles Layout Architecture

Трёхслойная SCSS-система: глобальная структура (`components/`), токены цветов (`styles.scss`),
layout-специфичные переопределения (`layouts/*/components/`). Единственный layout с собственными
переопределениями сейчас — default (island удалён). Здесь — только неочевидные инварианты.

## Что неочевидно

**Grey-900 — глобальный baseline, не layout-specific.**
`components/vue-select.scss` устанавливает grey-900 цвета для всех layouts.
Нельзя перемещать grey-900 в `body[data-layout="default"]` — элементы без layout-переопределения
потеряют цвет.

**CSS var-токены определяются в `styles.scss`, а не в layout-файлах.**
Блок `body[data-layout="default"]` с `--c-*` переменными хранится в одном файле рядом с консьюмерами
(`.text-color-base { color: var(--c-text-base) }`). Разносить его по layout-директориям не имеет смысла:
консьюмеры останутся в `styles.scss`, а новый layout потребует правки только одного файла.

**Правило, которое нужно только одному layout, должно быть scoped.**
Без `body[data-layout="..."]` или `@mixin apply` в layout-файле оно станет глобальным.

**`!important` — только с тегом.**
`!important` сравнивается отдельно от специфичности, поэтому `body[data-layout="default"] .rule { ... !important }`
побеждает над scoped Vue-стилями (у которых `[data-v-hash]` даёт (0,4,0)).
Каждый `!important` обязан иметь комментарий-тег: `[forced-vuetify]`, `[forced-pseudo]`
(пример — `styles.scss`, блок у `::placeholder`).

## Связанные

- [[code-conventions]] — общие code conventions проекта
- [[architecture]] — стили в общей архитектуре репозитория
