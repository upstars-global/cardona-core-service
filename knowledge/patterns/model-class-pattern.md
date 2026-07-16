---
title: Паттерн модели-класса
type: pattern
source: src/@model/
tags: []
updated: 2026-07-16
---

# Паттерн модели-класса

Данные в проекте описываются не голыми объектами, а классами-моделями. Стандарт: для сущности `Xxx` объявляется интерфейс входных данных `IXxxData` (в коде часто `XxxInput`) и класс `Xxx` с конструктором, который принимает этот объект и раскладывает поля по свойствам. Экземпляр создаётся через `new Xxx({...})` — это даёт типобезопасность, значения по умолчанию, инкапсуляцию и сериализацию через `toJSON()`.

## API / Сигнатура
- `interface PermissionInput { access: number; target: string }` — форма входных данных
- `new Permission(data: PermissionInput): Permission` — конструктор принимает объект
- `permission.changeAccess(access: number): void` — мутация приватного поля `_access`
- `get access(): number` — геттер вместо публичного поля
- `permission.toJSON(): { access, target }` — сериализация для отправки на бэкенд
- `class PermissionUpdatableTable extends Permission` — наследование с расширением интерфейса и вызовом `super(...)`

## Пример
```ts
export interface PermissionInput {
  readonly access: number
  readonly target: string
}

export class Permission {
  private _access: number
  readonly target: string

  constructor(data: PermissionInput) {
    this._access = data.access
    this.target = data.target
  }

  public changeAccess(access: number) {
    this._access = access
  }

  get access() {
    return this._access
  }

  toJSON() {
    return { access: this._access, target: this.target }
  }
}

// использование
const perm = new Permission({ access: 1, target: 'payouts' })
```

## Стандарты проекта
- Все данные — классы с интерфейсами, `new User({...})`, а не `{ firstName: '...' }` (см. [[code-conventions]]).
- Интерфейс входа: `I` + имя сущности + `Data` (`IProjectsData`); класс — имя сущности без префикса (`ProjectsForm`, `ProjectsListItem`).
- Приватные поля через `_field` + геттер; мутации — через явные методы (`changeAccess`).
- `toJSON()` для сериализации перед отправкой; наследование через `extends` + `super(...)` (пример — `PermissionUpdatableTable`).
- Простые модели могут содержать лишь конструктор с деструктуризацией (`FilterID`, `FilterSearch`, `FilterProject` в `filter.ts`).

## Связанные
- [[code-conventions]]
- [[permission]]
- [[filter]]
- [[user]]
