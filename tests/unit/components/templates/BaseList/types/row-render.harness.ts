import { permissionsMock } from '../../../../mocks/base-list/static-mock'
import { flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'
import { h } from 'vue'
import type { Component } from 'vue'
import type { IBaseListConfig } from '../../../../../../src/@model/templates/baseList'
import { BaseListSlots } from '../../../../../../src/@model/templates/baseList'
import { FilterID } from '../../../../../../src/@model/filter'
import { ListFieldType, TableField } from '../../../../../../src/@model/templates/tableFields'
import { getMountComponent, global, mockBaseStoreCore } from '../../../../mocks/base-list/utils'
import StatusField from '../../../../../../src/components/templates/_components/StatusField.vue'
import SumAndCurrency from '../../../../../../src/components/templates/_components/SumAndCurrency.vue'
import StatementField from '../../../../../../src/components/templates/_components/StatementField.vue'
import DateWithSecondsField from '../../../../../../src/components/templates/_components/DateWithSecondsField.vue'
import CopyField from '../../../../../../src/components/templates/_components/CopyField.vue'
import PillStatusField from '../../../../../../src/components/templates/BaseList/_components/fields/PillStatusField.vue'
import NameWithIdField from '../../../../../../src/components/templates/BaseList/_components/fields/NameWithIdField.vue'
import NameWithShortIdField from '../../../../../../src/components/templates/BaseList/_components/fields/NameWithShortIdField.vue'
import EmailField from '../../../../../../src/components/templates/BaseList/_components/fields/EmailField.vue'
import DateField from '../../../../../../src/components/templates/BaseList/_components/fields/DateField.vue'
import BadgesField from '../../../../../../src/components/templates/BaseList/_components/fields/BadgesField.vue'
import PositionField from '../../../../../../src/components/templates/BaseList/_components/fields/PositionField.vue'
import ButtonField from '../../../../../../src/components/templates/BaseList/_components/fields/ButtonField.vue'
import CommentField from '../../../../../../src/components/templates/BaseList/_components/fields/CommentField.vue'
import ImageField from '../../../../../../src/components/templates/BaseList/_components/fields/ImageField.vue'
import ImageDetailField from '../../../../../../src/components/templates/BaseList/_components/fields/ImageDetailField.vue'
import DatePeriodField from '../../../../../../src/components/templates/BaseList/_components/fields/DatePeriodField.vue'
import CopyShortField from '../../../../../../src/components/templates/BaseList/_components/fields/CopyShortField.vue'
import ItemActions from '../../../../../../src/components/templates/BaseList/_components/fields/ItemActions.vue'

/**
 * Harness для рядків BaseList (default-тип, compact не покриваємо).
 *
 * Кейс описує ТІЛЬКИ вхід (`key/type/value`) і, за потреби, слоти;
 * все інше harness виводить сам:
 *  - `type` -> очікуваний дочірній компонент BaseListCell (див. TYPE_COMPONENT), перевіряється автоматично;
 *  - слоти -> декларативно через `slots: { cell, nameWithIdTitle, ... }`, очікування «текст слота в td» теж автоматичне;
 *  - expand-рядки -> `expand: { ... }`.
 */

/** ListFieldType -> компонент, який BaseListCell має відрендерити (без data-test-id у джерелі). */
export const TYPE_COMPONENT: Partial<Record<ListFieldType, Component>> = {
  [ListFieldType.Status]: StatusField,
  [ListFieldType.PillStatus]: PillStatusField,
  [ListFieldType.SumAndCurrency]: SumAndCurrency,
  [ListFieldType.NameWithId]: NameWithIdField,
  [ListFieldType.NameWithShortId]: NameWithShortIdField,
  [ListFieldType.Email]: EmailField,
  [ListFieldType.Date]: DateField,
  [ListFieldType.DateWithSeconds]: DateWithSecondsField,
  [ListFieldType.Statement]: StatementField,
  [ListFieldType.Badges]: BadgesField,
  [ListFieldType.Priority]: PositionField,
  [ListFieldType.Button]: ButtonField,
  [ListFieldType.Comment]: CommentField,
  [ListFieldType.Image]: ImageField,
  [ListFieldType.ImageFull]: ImageDetailField,
  [ListFieldType.Period]: DatePeriodField,
  [ListFieldType.Copy]: CopyField,
  [ListFieldType.CopyShort]: CopyShortField,
}

/**
 * Слоти, які BaseList прокидає в BaseListCell. Значення — текст, який слот рендерить;
 * harness сам монтує слот під правильним ім'ям і сам перевіряє, що текст з'явився в td.
 */
export interface CellSlots {
  /** `cell(key)` — повністю перебиває дефолтний рендер клітинки */
  cell?: string
  /** `cellExpand(key)` — те саме, але для expand-рядка (потрібен `expand`) */
  cellExpand?: string
  /** `${key}-nameWithIdTitle` (для NameWithId / NameWithShortId) */
  nameWithIdTitle?: string
  /** `${key}-badgeTitle` (для Badges) */
  badgeTitle?: string
}

export interface RowCellDef {
  /** ключ поля = ключ колонки, `td[data-c-field="<key>"]` */
  key: string
  type?: ListFieldType
  title?: string
  /** значення клітинки: `cell = row[key]` */
  value?: unknown
  /** додаткові поля raw-рядка (напр. `{ currency: 'USD' }` для SumAndCurrency) */
  rawExtra?: Record<string, unknown>
  /** очікуваний текст у td (contains) */
  text?: string
  /** `data-test-id` усередині td (для полів, що їх мають) */
  testId?: string | string[]
  /** явно вказати очікуваний дочірній компонент; `false` — вимкнути авто-перевірку за `type` */
  child?: Component | false
  slots?: CellSlots
}

const defaultPermissions = { ...permissionsMock }

export interface MountRowOptions {
  /** патч до `basePermissions` (canUpdate/canRemove/canCreate/...); перед кожним mount скидається до дефолту */
  permissions?: Partial<typeof permissionsMock>
  rowId?: string | number
  /** патч до `config` поверх дефолтного */
  config?: Partial<IBaseListConfig> & Record<string, unknown>
  /** глобальні слоти BaseList для колонки `actions` (`prepend/append/details-action-item`) */
  actionSlots?: {
    prepend?: string
    append?: string
    details?: string
  }
  /** сирі додаткові слоти BaseList */
  extraSlots?: Record<string, unknown>
  /**
   * Expand: монтує рядок з `groups` і `config.showExpand`, у `toggleKey` клітинку кладе кнопку-тригер
   * (`[data-test-id="expand-toggle"]`), що викликає `toggleExpand` зі slot-payload.
   */
  expand?: { toggleKey: string, groups: Record<string, unknown>[] }
}

export interface MountedRow {
  wrapper: VueWrapper<any>
  row: Record<string, any>
  cells: RowCellDef[]
  rowEl: ReturnType<VueWrapper<any>['find']>
  /** `td` основного рядка */
  cellEl: (key: string) => ReturnType<VueWrapper<any>['find']>
  /** `td` expand-рядка (`data-c-expand-field`) */
  expandCellEl: (key: string) => ReturnType<VueWrapper<any>['find']>
  /** розгорнути рядок (потребує `expand`) */
  toggleExpand: () => Promise<void>
}

export const cellSelector = (key: string) => `td[data-c-field="${key}"]`
export const expandCellSelector = (key: string) => `td[data-c-expand-field="${key}"]`
const slotTestId = (name: string) => `slot:${name}`
const textSlot = (name: string, text: string) => () => h('div', { 'data-test-id': slotTestId(name) }, text)

function buildSlots(cells: RowCellDef[], opts: MountRowOptions): Record<string, any> {
  const slots: Record<string, any> = { ...opts.extraSlots }
  const { actionSlots = {}, expand } = opts

  for (const c of cells) {
    const s = c.slots ?? {}
    if (s.cell !== undefined)
      slots[`cell(${c.key})`] = textSlot(`cell(${c.key})`, s.cell)
    if (s.cellExpand !== undefined)
      slots[`cellExpand(${c.key})`] = textSlot(`cellExpand(${c.key})`, s.cellExpand)
    if (s.nameWithIdTitle !== undefined)
      slots[`${c.key}-nameWithIdTitle`] = textSlot(`${c.key}-nameWithIdTitle`, s.nameWithIdTitle)
    if (s.badgeTitle !== undefined)
      slots[`${c.key}-badgeTitle`] = textSlot(`${c.key}-badgeTitle`, s.badgeTitle)
  }

  if (actionSlots.prepend !== undefined)
    slots[BaseListSlots.PrependActionItem] = textSlot(BaseListSlots.PrependActionItem, actionSlots.prepend)
  if (actionSlots.append !== undefined)
    slots[BaseListSlots.AppendActionItem] = textSlot(BaseListSlots.AppendActionItem, actionSlots.append)
  if (actionSlots.details !== undefined)
    slots[BaseListSlots.DetailsActionItem] = textSlot(BaseListSlots.DetailsActionItem, actionSlots.details)

  // expand-тригер: cell(toggleKey) отримує toggleExpand; якщо кейс уже поклав свій cell-слот — не перетираємо
  if (expand && !slots[`cell(${expand.toggleKey})`]) {
    slots[`cell(${expand.toggleKey})`] = ({ item, toggleExpand }: any) =>
      h('button', { 'data-test-id': 'expand-toggle', 'onClick': () => toggleExpand(item.id) }, 'toggle')
  }

  return slots
}

/** Монтує BaseList з одним рядком, зібраним з `cells`. */
export async function mountRow(cells: RowCellDef[], opts: MountRowOptions = {}): Promise<MountedRow> {
  const { rowId = 'row-1', config = {}, expand, permissions = {} } = opts
  Object.assign(permissionsMock, defaultPermissions, permissions)

  const fields = cells.map(c => new TableField({
    key: c.key,
    title: c.title ?? c.key,
    ...(c.type ? { type: c.type } : {}),
  }))

  const row: Record<string, any> = { id: rowId }
  for (const c of cells) {
    row[c.key] = c.value
    Object.assign(row, c.rawExtra)
  }
  if (expand)
    row.groups = expand.groups

  mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({ list: [row], total: 1 })

  const useList = () => ({ ListFilterModel: FilterID, entityName: 'Test', fields })

  const wrapper = getMountComponent(
    {
      useList,
      config: {
        filterList: [],
        loadingEndpointArr: [],
        loadingOnlyByList: false,
        ...(expand ? { showExpand: true } : {}),
        ...config,
      },
    },
    global,
    buildSlots(cells, opts),
  ) as VueWrapper<any>

  await flushPromises()

  return {
    wrapper,
    row,
    cells,
    rowEl: wrapper.find('tr[data-test-id="table-row"]'),
    cellEl: key => wrapper.find(cellSelector(key)),
    expandCellEl: key => wrapper.find(expandCellSelector(key)),
    toggleExpand: async () => {
      await wrapper.find('[data-test-id="expand-toggle"]').trigger('click')
      await flushPromises()
    },
  }
}

const toArray = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v])

/** Перевірка однієї клітинки за її описом: td → дочірній компонент → слоти → text → testId. */
function assertCell(td: ReturnType<VueWrapper<any>['find']>, c: RowCellDef, which: 'cell' | 'cellExpand') {
  const label = `td[${c.key}]`
  expect(td.exists(), `${label} must exist`).toBe(true)

  const slots = c.slots ?? {}
  const overridden = slots[which] !== undefined
  const child = c.child === undefined ? (c.type ? TYPE_COMPONENT[c.type] : undefined) : c.child

  if (child && !overridden && which === 'cell')
    expect(td.findComponent(child).exists(), `${label} must render child component for type "${c.type}"`).toBe(true)

  if (overridden) {
    const name = `${which}(${c.key})`
    expect(td.find(`[data-test-id="${slotTestId(name)}"]`).exists(), `${label} must render custom slot ${name}`).toBe(true)
    expect(td.text()).toContain(slots[which]!)
  }

  if (!overridden && which === 'cell') {
    for (const slotKey of ['nameWithIdTitle', 'badgeTitle'] as const) {
      const text = slots[slotKey]
      if (text === undefined)
        continue
      const name = `${c.key}-${slotKey}`
      expect(td.find(`[data-test-id="${slotTestId(name)}"]`).exists(), `${label} must render slot ${name}`).toBe(true)
      expect(td.text()).toContain(text)
    }
  }

  if (c.text !== undefined)
    expect(td.text(), `${label} text`).toContain(c.text)

  for (const id of toArray(c.testId))
    expect(td.find(`[data-test-id="${id}"]`).exists(), `[data-test-id="${id}"] inside ${label}`).toBe(true)
}

/** Один виклик — повна перевірка рядка за тим самим `cells`, що й при mount. */
export function expectRow(m: MountedRow): void {
  expect(m.rowEl.exists(), 'tr[data-test-id="table-row"] must exist').toBe(true)
  for (const c of m.cells)
    assertCell(m.cellEl(c.key), c, 'cell')
}

/** Перевірка expand-рядка (після `toggleExpand`): тільки клітинки зі `slots.cellExpand` або `text`. */
export function expectExpandRow(m: MountedRow, cells: RowCellDef[] = m.cells): void {
  for (const c of cells) {
    if (c.slots?.cellExpand === undefined && c.text === undefined)
      continue
    assertCell(m.expandCellEl(c.key), c, 'cellExpand')
  }
}

/** Колонка `actions` рендерить ItemActions (дозволи/слоти меню перевіряємо через `.text()`/slot-test-id). */
export function expectItemActions(m: MountedRow, actionKey = 'actions'): void {
  expect(m.cellEl(actionKey).findComponent(ItemActions).exists(), `ItemActions must render in "${actionKey}" column`).toBe(true)
}

/** Slot-payload: що саме BaseList прокинув у слот (field/item/cell/index/toggleExpand/...). */
export function captureSlot(name: string) {
  let props: Record<string, any> | null = null
  const slot = (p: Record<string, any>) => {
    props = p
    return h('div', { 'data-test-id': slotTestId(name) }, name)
  }
  return { name, slot, props: () => props }
}

/** Відкриває меню дій рядка і повертає, які пункти в ньому є (за `data-test-id`). */
export async function openActionMenu(m: MountedRow, actionKey = 'actions') {
  const activator = m.cellEl(actionKey).find('[data-test-id="activator"]')
  if (activator.exists()) {
    await activator.trigger('click')
    await flushPromises()
  }
  const has = (testId: string) => m.cellEl(actionKey).find(`[data-test-id="${testId}"]`).exists()
  return { hasMenu: activator.exists(), has }
}
