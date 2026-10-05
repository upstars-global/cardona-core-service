# Контракт-тестирование BaseList/BaseSection

`createBaseListContract`/`createBaseSectionContract` генерируют стандартный набор
Vitest-спеков (store state, рендер полей, CRUD, permission-гейты) из конфига ~40 строк,
вместо ручной спеки на каждую секцию. `entityName`/`fields`/`EntityFormClass`/`useStore`
берутся напрямую из реального `useList()`/`useEntity()`, не дублируются в конфиге.

## Статус (2026-10-05)

Готово и покрыто тестами (коммит `ff8ffd35`, branch `test_complex`): консолидация
`mocks/baselist` → `mocks/base-list`, общие фабрики моков в `tests/unit/mocks/shared/`
(`createStoreMockFactory`, `createLoaderStoreMock`, `createBaseSectionErrorsStoreMock`,
`createBasePermissionsMock`), оба генератора + pilot-спеки.

Осталось: pilot на `src/pages/demo` (первый реальный тест ветки `customStoreMock` —
`useDemoSection` использует `useDemoStore`), миграция 2-3 реальных секций cardona
(`gifts`/`players` как чистый `baseStoreCore`, `payouts` как стресс-тест
`actions.fetch: 'custom'`), документация в
`.claude/skills/write-tests/references/advanced-patterns.md`, общий chrome-спек
export/search/settings, проверка i18n-полноты лейблов. `SideBarModel` — опционально,
вне v1 (только `promo/banners` его использует).

## Что неочевидно

- **`fetchEntityList` мокается целиком, в обход `ListItemModel`.** Сравнение
  отрендеренной ячейки с тем же значением, которое подали на вход мока — тавтология,
  никогда не падает, даже если модель сломана. Контракт сам вызывает
  `new ListItemModel(sampleBackendResponse)` и сверяет рендер с **независимым**
  `expectedFieldValues` — без него проверка ловит только существование `<td>`, которое
  `BaseList` рендерит для любого поля конфига вне зависимости от данных.
- **Toggle-status в `BaseList` всегда `baseStoreCore.updateEntity`**, независимо от
  `useStore`. В `BaseSection` каждое действие резолвится независимо:
  `customStore?.X ?? baseStoreCore.X`. Разная семантика, не унифицировать.
- **`new EntityFormClass(data)` одинаково работает и для класса, и для factory-функции**
  (как `gifts.EntityFormClass`, диспетчер по `GiftType`) — `new` на функции, явно
  возвращающей объект, резолвится в этот объект; так же делает сам
  `BaseSection/types/default.vue`.
- **`vi.mock`-фабрика не может напрямую читать переменную из того же файла** (TDZ —
  хостится выше объявления). Рабочий паттерн: объявлять мок в соседнем `utils.ts`,
  импортировать в `static.ts`; если нужен `toHaveBeenCalledWith` на моке — оборачивать
  в `vi.fn((...args) => realMock.fn(...args))`, голый arrow-wrapper вызовы не трекает.
- **Кастомный стор секции нельзя замокать внутри генератора** (`vi.mock` статический,
  per-файл) — вызывающий спек обязан сам замокать модуль стора и передать мок через
  `customStoreMock`, иначе генератор бросает ошибку.
- **Select — никогда не `ListFieldType`** (`tableFields.ts`), только `SelectBaseField`/
  `MultiSelectBaseField` на стороне формы. Проверка `selectFields` поэтому живёт в
  `createBaseSectionContract`, не в `createBaseListContract`.

## Пример

```ts
createBaseListContract({
  useList: useGiftsList,
  sampleBackendResponse: { id: 1, name: 'Item 1', minutes: 90 },
  expectedFieldValues: { minutesLabel: '1h 30m' }, // независимый ground truth
  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
    delete: { expect: 'deleteEntity', refetchesAfter: true },
    toggleStatus: { expect: 'baseStoreCore.updateEntity' },
  },
})
```
