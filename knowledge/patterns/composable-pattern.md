---
title: Паттерн composable
type: pattern
source: src/composables/
tags: []
updated: 2026-07-16
---

# Паттерн composable

Composable-ы ядра — это функции с префиксом `useXxx`, которые инкапсулируют переиспользуемую логику (HTTP-клиент, смена проекта и т.п.). Именование: `use` + сущность/действие. Возвращают либо готовый инстанс/фабрику (как `useApi`), либо объект с именованными методами (как `useChangeProject`).

## API / Сигнатура
- `useApi = createFetch({...})` — фабрика fetch-клиента на базе `@vueuse/core`. Подставляет `baseUrl`, `Authorization: Bearer <accessToken>` из cookie в `beforeFetch`, парсит ответ через `destr` в `afterFetch`.
- `useChangeProject(): { changeProject }` — composable для смены активного проекта.
- `changeProject(project: ProjectInfoInput, withoutNavigation?: boolean): Promise<void>` — сохраняет id проекта в `sessionStorage`/`localStorage`, вызывает `userStore.setSelectedProject(project)` и (если не `withoutNavigation`) навигирует.

## Пример
```ts
// готовый инстанс-экспорт
export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  options: {
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value
      if (accessToken)
        options.headers = { ...options.headers, Authorization: `Bearer ${accessToken}` }

      return { options }
    },
  },
})

// объект с методами
const { changeProject } = useChangeProject()
await changeProject(project, true)
```

## Стандарты проекта
- Имя — `use` + существительное/действие, файл называется так же (см. [[code-conventions]]).
- Возвращать объект с именованными методами, а не позиционный массив.
- Внутри composable можно обращаться к Pinia-store (`useUserStore`) и роутеру — но `ApiService`-вызовы держи в actions store, не в composable.
- Типы параметров импортируй через `import type` (`ProjectInfoInput`).

## Связанные
- [[useApi]]
- [[apiservice-routing]]
- [[pinia-store-pattern]]
- [[user]]
- [[code-conventions]]
