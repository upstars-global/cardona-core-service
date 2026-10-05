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

Generic chrome (search/settings/export) — один общий regression-тест в
`default.spec.ts`, не per-контракт (поиск и settings уже были покрыты; добавлен
недостающий export-toggle, заодно нашёл и убрал из генератора нерабочую раннюю попытку —
см. ниже).

Проверка i18n-полноты лейблов реализована в обоих генераторах (`i18nChecks.ts`): для
`BaseList` — эвристика по форме уже резолвленного `field.title` (см. "Что неочевидно"), для
`BaseSection` — прямой `i18n.te(field.label)` на инстансе формы. Оба варианта проверены
негативным контролем (поддельный `page.totally.missing.key` реально падает).

**Заблокировано (не моё решение):** реальный запуск этих тестов в самом репозитории `cardona`
требует релиза этой ветки (`cardona` зависит от `cardona-core-service` как от зафиксированного
GitHub-тега, сейчас `v8.4.5` — генераторов там ещё нет) — конфиги ниже справочные,
не выполнялись в `cardona`. `SideBarModel` — опционально, вне v1 (только `promo/banners`
его использует).

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
- **Search/settings/export в `BaseList` — opt-in через `BaseListConfig`, не default-on.**
  Ни `withSearch`, ни `withSettings`, ни `withExport` не имеют дефолта `true` в конструкторе
  (`@model/templates/baseList.ts`) — без явного флага в конфиге секции кнопка просто не
  рендерится, это не баг. Экспорт дополнительно требует `canExport` из `basePermissions()`.
  Реальный `data-test-id` кнопки экспорта — `export-format-selector`
  (`ListSearch.vue`), не `export-button`: ранняя версия `createBaseListContract` проверяла
  несуществующий тест-id и никогда не могла упасть — убрана, generic-проверка теперь живёт
  в `default.spec.ts` рядом с уже существовавшими toggle-тестами search/settings.
- **`TableField.title` и `BaseField.label` резолвятся по-разному — i18n-проверка для них
  тоже разная.** `useList()` вызывает `i18n.t(key)` сам и возвращает уже готовую строку, так
  что к моменту, когда контракт видит `fields`, ключа уже нет — проверяем эвристикой "похоже
  ли резолвленное значение на нерезолвленный dotted-key" (`i18nChecks.ts`). `BaseField.label`
  — геттер (`base.ts`), который сам вызывает `i18n.te()`/`i18n.t()` при каждом обращении и
  возвращает ключ как есть, если перевода нет — поэтому для формы можно и нужно проверять
  `i18n.te(label)` напрямую, без эвристики. Оба варианта не ловят рендер форм через
  `FieldGeneratorStub` (он не вызывает `$t()` вообще) — именно поэтому `BaseSection`-проверка
  читает `label` с инстанса модели, а не из DOM.

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

## Stage 6 (TODO, не реализовано) — поддержка `SideBarModel`

Опционально, вне v1 — единственный потребитель сегодня: `promo/banners`
(`BannersSideBarFields`, см. Stage 5 выше). Ничего из описанного ниже не реализовано;
раздел фиксирует то, что уже выяснено про механизм, чтобы не переисследовать с нуля.

**Как это устроено (прочитано из src/):**

- `UseListType`'s 3-й generic — `SideBarModel?: new (...args: any[]) => SideBarModel`
  (`src/@model/templates/baseList.ts:46`) — класс, не инстанс, как и `ListItemModel`.
- Рендерится только при `config.sidebar === true`
  (`src/components/templates/BaseList/types/default.vue:699`,
  `<SideBar v-if="config.sidebar" :side-bar-model="SideBarModel">`) — тот же opt-in
  паттерн, что у `withSearch`/`withSettings`/`withExport` (см. "Что неочевидно" выше).
- `SideBar/index.vue:55` инстанцирует модель лениво, на выбранном элементе:
  `viewForm.value = new props.sideBarModel(item)` — аналог `new ListItemModel(...)`
  в `fetchEntityList`, только по требованию (открыл конкретную строку), а не на весь список.
- Инстанс `SideBarModel` — это **не массив `TableField`**, а объект, где каждое поле —
  `SideBarCollapseItem` (`src/@model/templates/baseList.ts:533`): `{ title, withBottomSeparator,
  views: Record<string, ViewInfo> }`. Каждый `ViewInfo` (`src/@model/view.ts:106`) — отдельная
  структура с `type` (`ViewType` enum — другой enum, не `ListFieldType`), `value`, `label`,
  `description`, `icon`, `permission`.
- `ViewInfo.label` — **обычное read-only поле**, не геттер с автовызовом `i18n.te()`/`i18n.t()`
  (в отличие от `BaseField.label`, см. "Что неочевидно"). Вызывающий код сам решает, резолвить
  ли его через `i18n.t(...)` до передачи в конструктор (как делает `DemoSideBar`:
  `label: i18n.t('common.generalInformation')`) — значит для i18n-проверки `SideBarModel`
  нужна та же эвристика по форме строки, что для `TableField.title`, а не прямой `i18n.te()`,
  как для форм.

**Что нужно реализовать:**

1. Опциональный `sideBarModel?: new (...args: any[]) => unknown` в `BaseListContractConfig`
   (дериватив из `useList()`, как и остальные поля — не дублировать).
2. Structural integrity: `new SideBarModel(sampleBackendResponse)` не падает; каждый ключ
   `views` — валидный `ViewInfo`.
3. Рендер: замокать `config.sidebar: true`, открыть конкретную строку (как реально делает
   `SideBar/index.vue` — через клик/selected item, не напрямую вызывать конструктор в обход
   компонента), проверить что сайдбар рендерится без ошибок.
4. i18n-check для `ViewInfo.label` — эвристика `looksLikeI18nKey`, как для `TableField.title`
   (не `i18n.te()` напрямую, как для `BaseField.label` — другая структура, см. выше).
5. Нужен `expectedFieldValues`-аналог для `views` (ground truth, не тавтология) — та же
   проблема, что в Stage 2, только для `ViewInfo.value`, а не `TableField`.
