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

Документация расширена в `.claude/skills/write-tests/references/advanced-patterns.md`
(подсекция под "BaseList Component Tests"); примеры конфигов для реальных секций `cardona`
(`gifts`/`payouts`/`players`) — ниже, в "Stage 5 — примеры на реальных секциях".

**Заблокировано (не моё решение):** реальный запуск этих тестов в самом репозитории `cardona`
требует релиза этой ветки (`cardona` зависит от `cardona-core-service` как от зафиксированного
GitHub-тега, сейчас `v8.4.5` — генераторов там ещё нет) — конфиги ниже справочные,
не выполнялись в `cardona`. Общий chrome-спек export/search/settings и проверка i18n-полноты
лейблов — не реализованы ни разу. `SideBarModel` — опционально, вне v1 (только
`promo/banners` его использует).

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
  sampleBackendResponse: { id: '1', templateTitle: 'New Year gift', period: 90, isActive: true },
  expectedFieldValues: { timeForActivation: '1h 30m' }, // независимый ground truth
  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
    toggleStatus: { expect: 'baseStoreCore.updateEntity' },
  },
})
```

## Stage 5 — примеры на реальных секциях cardona (referencе, пока не executable)

**Важно:** `cardona` подключает `cardona-core-service` как зафиксированную GitHub-зависимость
(`v8.4.5` на момент написания), которая не содержит генераторы из этой ветки. Конфиги ниже
основаны на реальном коде `cardona` (прочитанном только для справки — сам репозиторий `cardona`
не редактировался) и показывают, как будет выглядеть подключение после релиза; реально выполнить
их в `cardona` можно будет только после merge/tag этой ветки и обновления зависимости.

### `gifts` — чистый `baseStoreCore`, реальный пример расхождения модели

`src/pages/gifts/gifts/list/useSection.ts`: `GiftsListItem.title = data?.templateTitle` (поле
модели называется `title`), но `TableField.key = 'templateTitle'` — ключ в конфиге не совпадает
с именем свойства модели. Сегодня это рендерит пустую ячейку; `expectedFieldValues` это бы
поймал сразу (ровно та же природа расхождения, что нашёл pilot на `demo` — см. выше).

```ts
createBaseListContract({
  useList: useGiftsList,
  sampleBackendResponse: { id: '1', templateTitle: 'New Year gift', period: 90, isActive: true },
  expectedFieldValues: {
    timeForActivation: '1h 30m', // GiftsListItem.timeForActivation = minutesToHumanReadable(period)
    // templateTitle сюда сознательно не добавлен — реальный рендер пуст, так и должно быть,
    // пока расхождение title/templateTitle не исправлено в самой секции
  },
  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
    toggleStatus: { expect: 'baseStoreCore.updateEntity' },
  },
})
```

### `payouts` — стресс-тест полностью кастомного стора

`src/pages/payouts/useSection.ts` → `useStore: usePayoutsStore`. Стор переопределяет
`fetchEntityList` полностью (фанаутит `Promise.all` по проектам, фильтрует/сортирует на
клиенте) — никакого стандартного `{ type, data: { perPage, page, filter, sort } }` payload.
Колонка `project` условна (`useUserStore().userProjects.length > 1`) — фикс-поля ниже покрывают
только безусловный набор.

```ts
import { usePayoutsStore } from '@/stores/payouts'

const payoutsStoreMock = createStoreMockFactory(['fetchEntityList'] as const)

vi.mock('@/stores/payouts', () => ({ usePayoutsStore: () => payoutsStoreMock.mock }))

createBaseListContract({
  useList: useList, // из src/pages/payouts/useSection.ts
  customStoreMock: payoutsStoreMock.mock,
  sampleBackendResponse: { id: '1', playerId: 'p1', amount: 500, vipStatus: 'gold' },
  actions: {
    fetch: 'custom', // не assert-ить payload — он не стандартный
  },
})
```

### `players` — минимальный baseline (list-only, без формы, без Select)

`src/pages/players/players/useSection.ts` — только `useList()`, без `useEntity()`, без
кастомного стора, без единого Select-поля. Хороший дефолтный кейс для проверки, что контракт
не требует ничего лишнего, когда у секции нет форм/кастомных сторов.

```ts
createBaseListContract({
  useList, // из src/pages/players/players/useSection.ts
  sampleBackendResponse: { id: '1', name: 'Player', nickname: 'pl1', vipStatus: 'silver' },
  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
  },
})
```
