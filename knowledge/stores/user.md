---
title: user store
type: store
source: src/stores/user.ts
tags: []
updated: 2026-07-16
---

# user store

Pinia store (`defineStore('user')`) с данными текущего пользователя: профиль (`UserInfo`), список прав (`permissions`), выбранный продукт и проект. Через свои getters предоставляет проверки доступа (`abilityCan`, `abilityCanInGroup`) и логику определения текущего проекта.

## API / Сигнатура

State:
- `userInfo: UserInfo` — текущий пользователь (id, projects, products, permissions, groups)
- `permissions: AllPermission` — сгруппированные права
- `selectedProduct: OptionsItem | null` — выбранный продукт
- `selectedProject / priorityProject: ProjectInfoInput | null` — выбранный / приоритетный проект

Getters:
- `abilityCan(target: string, access: number | PermissionLevel): boolean` — есть ли у пользователя доступ уровня `access` к `target`
- `abilityCanInGroup(group: PermissionGroup | string[], access: number | PermissionLevel, all = false): boolean` — проверка по группе прав (`all` → нужны все, иначе хотя бы один)
- `getSelectedProject: ProjectInfoInput` — итоговый проект: `priorityProject` → `selectedProject` → из storage → дефолтный
- `isExistsUser / isExistsProjects / isExistsGroups: boolean`
- `userProjects / userProducts` — списки проектов/продуктов
- `projectsBySelectedProduct` — проекты выбранного продукта
- `getSpecificProject(alias) / getProjectAliasById(id) / canViewVCoinInProject(alias)`

Actions:
- `fetchCurrentUser(): Promise<void>` — грузит `App.V2.Users.Current.Read`, заполняет `userInfo`, права и `selectedProduct`
- `setSelectedProduct(product) / setSelectedProject(project) / setPriorityProject(project)`
- `setUserInfo(userInfo: UserInfo)` — сброс проектов + установка пользователя и прав
- `clearProjects()` — очистка выбранных проектов
- `sendSessionsPing(status: UserActivityStatus): Promise<void>`

Отдельный экспорт: `fetchCurrentUserApi()` — низкоуровневый запрос, возвращает `UserInfo`.

## Пример
```ts
const userStore = useUserStore()

await userStore.fetchCurrentUser()

if (userStore.abilityCan('players', 'view')) {
  const project = userStore.getSelectedProject
  // ...
}
```

## Стандарты проекта
- Все `ApiService`-вызовы — только в actions стора (см. [[code-conventions]]).
- Уровни доступа: `noaccess=0, view=1, create=2, update=3, delete=4`; принимает и число, и строку.

## Связанные
- [[access-control]]
- [[permission]]
- [[pinia-store-pattern]]
- [[apiservice-routing]]
