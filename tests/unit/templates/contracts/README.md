# Контракт-тестирование BaseList/BaseSection

`createBaseListContract`/`createBaseSectionContract` генерируют стандартный набор
Vitest-спеков (store state, рендер полей, CRUD, permission-гейты) из конфига ~40 строк,
вместо ручной спеки на каждую секцию. `entityName`/`fields`/`EntityFormClass`/`useStore`
берутся напрямую из реального `useList()`/`useEntity()`, не дублируются в конфиге.

## Статус (2026-10-05)

Готово и покрыто тестами (branch `test_complex`): консолидация `mocks/baselist` →
`mocks/base-list`, общие фабрики моков в `tests/unit/mocks/shared/`
(`createStoreMockFactory`, `createLoaderStoreMock`, `createBaseSectionErrorsStoreMock`,
`createBasePermissionsMock`), оба генератора, pilot-спеки на синтетических фикстурах,
и pilot на реальной продакшен-секции `src/pages/demo`
(`tests/unit/pages/demo/demoList.contract.spec.ts`,
`tests/unit/pages/demo/demoSection.contract.spec.ts`) — включая ветку `customStoreMock`
на реальном `useDemoStore`.

Осталось: миграция 2-3 реальных секций cardona (`gifts`/`players` как чистый
`baseStoreCore`, `payouts` как стресс-тест `actions.fetch: 'custom'`), документация в
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
- **Композиции секции (`useList`/`useEntity`), которые вызывают `useI18n()`/другие
  injection-зависимые API, нельзя вызвать как голую функцию** — падает с "Must be called
  at the top of a setup function", даже если `config.global.plugins` (i18n/pinia) уже
  подключены для моунта. Оба генератора оборачивают вызов в `withSetup()`
  (`tests/unit/utils.ts`) — монтирует одноразовый компонент, вызывает композабл внутри
  его `setup()`, забирает результат, демонтирует.
- **Multi-delete в `BaseList` триггерится не напрямую**, а через
  `wrapper.vm.onRowSelected(items)` + `wrapper.vm.onClickDeleteMultiple()`; ветка на
  `multipleDeleteEntity` срабатывает только при 2+ выбранных id
  (`allSelectedIds` из `baseListSelectionStore`), один id идёт в обычный `deleteEntity`.
- **Формы с SEO/локализацией (`DemoForm` и, вероятно, другие) требуют мок `useUserStore`**
  с согласованными `getSelectedProject.locales`/`.mainLocale` — `getTranslationForm`
  строит `fieldTranslations` по `locales`, а `transformFormData` на submit пишет в
  `fieldTranslations[key][mainLocale]` (дефолт `'ru'`); рассинхрон между ними падает
  с "Cannot set properties of undefined", а не тихо игнорируется.
- **Pilot на `demo` уже нашёл реальный пример того, что должен ловить этот механизм**:
  несколько `TableField.key` в `useDemoList` (`shortId`, `nameSlot`, `innerLink`,
  `sumPeriod`, `winBack`) не соответствуют ни одному свойству `DemoListItem` — рендерят
  пустую ячейку сегодня. Это не баг демо-страницы (вне скоупа чинить), но подтверждает,
  зачем вообще нужен `expectedFieldValues`: без него такие расхождения проходят молча.

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
