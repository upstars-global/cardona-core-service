---
title: ItemActionCopy
type: component
source: src/components/templates/BaseList/_components/fields/ItemActionCopy.vue
source_hash: ece5689934e0
tags: [baselist, actions]
updated: 2026-10-20
---

# ItemActionCopy

Пункт меню действий строки списка «Сделать копию». Копирование — это переход на страницу создания (`createPageName`), а не вызов API.

## Что неочевидно

- **Два режима с разными параметрами роута.** Копия в текущий проект: `router.push({ name, params: { id } })`. Копия через подменю проектов: новая вкладка (`window.open`) с `params: { type: 'copy', id, project }`. Страница Create должна уметь читать оба набора.
- **`query: { forProject, fromProject }` добавляется только для чужого проекта**; для текущего проекта в подменю `query` пустой, а `params` те же.
- **Подменю появляется только при `copyForAllProjects` и более чем одном проекте** в `verifiedProjects`. Иначе — обычный пункт без подменю, даже если флаг включён.
- **«Текущий проект» определяется сравнением `title` с `userStore.getSelectedProject.name`**, а не по `alias`. Переименование проекта или совпадение названий сломает пометку.
