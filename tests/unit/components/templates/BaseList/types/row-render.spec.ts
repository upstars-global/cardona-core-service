import '../../../../mocks/base-list/static-mock'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListFieldType } from '../../../../../../src/@model/templates/tableFields'
import { ModalsId } from '../../../../../../src/@model/modalsId'
import BaseListCell from '../../../../../../src/components/templates/BaseList/_components/BaseListCell.vue'
import { modalSpy, toggleStatusEntity, updateEntity } from '../../../../mocks/base-list/utils'
import type { RowCellDef } from './row-render.harness'
import { captureSlot, expectExpandRow, expectItemActions, expectRow, mountRow, openActionMenu } from './row-render.harness'

/** Мінімальні валідні значення для кожного типу — harness сам знає, який компонент очікувати. */
const TYPE_CASES: [ListFieldType, RowCellDef['value'], Partial<RowCellDef>?][] = [
  [ListFieldType.Status, 'active', { testId: 'status-field' }],
  [ListFieldType.PillStatus, true, { testId: 'pill-status' }],
  [ListFieldType.SumAndCurrency, 100, { rawExtra: { currency: 'USD', remainder: 5 }, text: 'USD' }],
  [ListFieldType.NameWithId, 'Name', { rawExtra: { name: 'Name' }, testId: ['name', 'copy-field'], text: 'Name' }],
  [ListFieldType.NameWithShortId, 'Name', { rawExtra: { name: 'Name' }, testId: ['name', 'copy-field'], text: 'Name' }],
  [ListFieldType.Email, 'a@b.com', { rawExtra: { email: 'a@b.com' }, testId: 'email-text', text: 'a@b.com' }],
  [ListFieldType.Date, '2024-01-02T12:00:00Z', { text: '.01.2024' }],
  [ListFieldType.DateWithSeconds, '2024-01-02T12:00:05Z', { text: '.01.2024' }],
  [ListFieldType.Statement, true, { testId: 'statement-badge', text: 'Yes' }],
  [ListFieldType.Badges, [{ name: 'b1' }], { testId: 'badge-0' }],
  [ListFieldType.Priority, 3, { testId: 'position-read-text', text: '3' }],
  [ListFieldType.Button, 'Click', { text: 'Click' }],
  [ListFieldType.Comment, 'some comment', { testId: 'comment-text' }],
  [ListFieldType.Image, 'img.png', { testId: 'image-block' }],
  [ListFieldType.ImageFull, { imagePath: 'img.png' }, { testId: 'image-block' }],
  [ListFieldType.Period, { dateFrom: '2024-01-01T12:00:00Z', dateTo: '2024-02-01T12:00:00Z' }, { text: '.2024' }],
  [ListFieldType.Copy, 'copy-me', { testId: 'copy-field-value', text: 'copy-me' }],
  [ListFieldType.CopyShort, 'copy-short', { testId: 'copy-field-icon' }],
]

describe('BaseList row render', () => {
  it('default cell renders raw value', async () => {
    expectRow(await mountRow([{ key: 'name', value: 'Item 1', text: 'Item 1' }]))
  })

  it('Percent renders "<value> %"', async () => {
    expectRow(await mountRow([{ key: 'p', type: ListFieldType.Percent, value: 12, text: '12 %' }]))
  })

  it.each(TYPE_CASES)('type "%s" renders its child component', async (type, value, extra) => {
    expectRow(await mountRow([{ key: 'f', type, value, ...extra }]))
  })

  it('cell() slot overrides the type component', async () => {
    const m = await mountRow([{ key: 'f', type: ListFieldType.Status, value: 'x', child: false, slots: { cell: 'Custom' } }])

    expectRow(m)
  })

  it('cell() slot payload carries field/item/cell', async () => {
    const cap = captureSlot('cell(name)')
    const m = await mountRow([{ key: 'name', value: 'Item 1' }], { extraSlots: { 'cell(name)': cap.slot } })

    expect(m.cellEl('name').text()).toContain('cell(name)')
    expect(cap.props()).toMatchObject({ field: expect.objectContaining({ key: 'name' }), cell: 'Item 1' })
  })

  it('nameWithIdTitle slot is forwarded into NameWithId', async () => {
    expectRow(await mountRow([{
      key: 'name', type: ListFieldType.NameWithId, value: 'N', rawExtra: { name: 'N' }, slots: { nameWithIdTitle: 'Extra title' },
    }]))
  })

  it('badgeTitle slot is forwarded into Badges', async () => {
    expectRow(await mountRow([{
      key: 'b', type: ListFieldType.Badges, value: [{ name: 'b1' }], slots: { badgeTitle: 'Badge title' },
    }]))
  })

  it('actions column renders ItemActions with action-item slots', async () => {
    const m = await mountRow([{ key: 'name', value: 'x' }, { key: 'actions' }], {
      actionSlots: { prepend: 'PRE', append: 'APP' },
    })

    expectItemActions(m)
  })

  describe('actions menu', () => {
    const cells: RowCellDef[] = [{ key: 'name', value: 'x' }, { key: 'actions', rawExtra: { isActive: true } }]

    it('canRemove: remove item is shown / hidden', async () => {
      expect((await openActionMenu(await mountRow(cells))).has('remove')).toBe(true)
      expect((await openActionMenu(await mountRow(cells, { permissions: { canRemove: false } }))).has('remove')).toBe(false)
    })

    it('config.withDeactivation shows status-toggle only with canUpdate', async () => {
      const config = { withDeactivation: true }

      expect((await openActionMenu(await mountRow(cells, { config }))).has('status-toggle')).toBe(true)
      expect((await openActionMenu(await mountRow(cells, { config, permissions: { canUpdate: false } }))).has('status-toggle')).toBe(false)
      expect((await openActionMenu(await mountRow(cells))).has('status-toggle')).toBe(false)
    })

    it('config.createFromCopy shows copy item only with canCreate', async () => {
      const config = { createFromCopy: true }

      expect((await openActionMenu(await mountRow(cells, { config }))).has('copy')).toBe(true)
      expect((await openActionMenu(await mountRow(cells, { config, permissions: { canCreate: false } }))).has('copy')).toBe(false)
      expect((await openActionMenu(await mountRow(cells))).has('copy')).toBe(false)
    })

    it('no permissions and no slots -> no menu at all', async () => {
      const m = await mountRow(cells, { permissions: { canUpdate: false, canUpdateSeo: false, canCreate: false, canRemove: false } })

      expect((await openActionMenu(m)).hasMenu).toBe(false)
    })

    it('prepend/append slots alone are enough to show the menu', async () => {
      const m = await mountRow(cells, {
        permissions: { canUpdate: false, canUpdateSeo: false, canCreate: false, canRemove: false },
        actionSlots: { prepend: 'PRE' },
      })

      const menu = await openActionMenu(m)

      expect(menu.hasMenu).toBe(true)
      expect(m.cellEl('actions').text()).toContain('PRE')
    })
  })

  describe('slot payload contract (default.vue -> BaseListCell -> consumer)', () => {
    it('cell(key): full payload', async () => {
      const cap = captureSlot('cell(name)')
      const m = await mountRow([{ key: 'name', value: 'Item 1' }], { extraSlots: { 'cell(name)': cap.slot } })
      const p = cap.props()!

      expect(p.field).toMatchObject({ key: 'name' })
      expect(p.item).toEqual(m.row) // raw
      expect(p.value).toEqual(m.row)
      expect(p.cell).toBe('Item 1')
      expect(p.index).toBe(0)
      expect(p).toMatchObject({ canCreate: true, canRemove: true, isExpanded: false })
      expect(p.createPageName).toEqual(expect.any(String))
      for (const fn of ['getUpdateRoute', 'toggleExpand', 'onClickRemove'])
        expect(p[fn], fn).toEqual(expect.any(Function))
      expect(p).toHaveProperty('inlineFilters')
    })

    it('cell(key): canRemove/canCreate follow permissions', async () => {
      const cap = captureSlot('cell(name)')

      await mountRow([{ key: 'name', value: 'x' }], { extraSlots: { 'cell(name)': cap.slot }, permissions: { canRemove: false, canCreate: false } })
      expect(cap.props()).toMatchObject({ canCreate: false, canRemove: false })
    })

    it('nameWithIdTitle: item + canUpdate', async () => {
      const cap = captureSlot('name-nameWithIdTitle')
      const m = await mountRow([{ key: 'name', type: ListFieldType.NameWithId, value: 'N', rawExtra: { name: 'N' } }], { extraSlots: { 'name-nameWithIdTitle': cap.slot } })

      expect(cap.props()).toMatchObject({ item: m.row, canUpdate: true })

      const cap2 = captureSlot('name-nameWithIdTitle')

      await mountRow([{ key: 'name', type: ListFieldType.NameWithId, value: 'N', rawExtra: { name: 'N' } }], { extraSlots: { 'name-nameWithIdTitle': cap2.slot }, permissions: { canUpdate: false } })
      expect(cap2.props()!.canUpdate).toBe(false)
    })

    it('badgeTitle: item + cell + value (single badge)', async () => {
      const cap = captureSlot('b-badgeTitle')
      const badges = [{ name: 'b1' }]
      const m = await mountRow([{ key: 'b', type: ListFieldType.Badges, value: badges }], { extraSlots: { 'b-badgeTitle': cap.slot } })

      expect(cap.props()).toMatchObject({ item: m.row, cell: badges })
      expect(cap.props()!.value).toEqual(badges[0])
    })

    it('action-item slots: payload', async () => {
      const prepend = captureSlot('prepend-action-item')
      const append = captureSlot('append-action-item')
      const details = captureSlot('details-action-item')

      const m = await mountRow([{ key: 'name', value: 'x' }, { key: 'actions' }], {
        extraSlots: { 'prepend-action-item': prepend.slot, 'append-action-item': append.slot, 'details-action-item': details.slot },
      })

      await openActionMenu(m)
      expect(prepend.props()).toMatchObject({ canUpdate: true })
      expect(append.props()).toMatchObject({ canUpdate: true, canCreate: true, entityName: 'Test' })
      expect(details.props()).toHaveProperty('pageName')
      for (const c of [prepend, append, details])

        // на відміну від cell()/nameWithIdTitle/badgeTitle (raw), тут приходить vuetify-обгортка { raw, value, ... }
        expect(c.props()!.item, c.name).toMatchObject({ raw: m.row, value: m.row })
    })
  })

  describe('events: BaseListCell -> BaseList handlers', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    const emitFromCell = async (cells: RowCellDef[], event: string, ...args: unknown[]) => {
      const m = await mountRow(cells)

      m.wrapper.findComponent(BaseListCell).vm.$emit(event, ...args)
      await flushPromises()

      return m
    }

    it('edit-position -> updateEntity({ id, position })', async () => {
      await emitFromCell([{ key: 'p', type: ListFieldType.Priority, value: 1 }], 'edit-position', { id: 'row-1' }, 5)
      expect(updateEntity).toHaveBeenCalledWith(expect.objectContaining({ type: 'Test', data: { form: { id: 'row-1', position: 5 } } }))
    })

    it('open-edit -> editingId is passed back to cell', async () => {
      const m = await emitFromCell([{ key: 'p', type: ListFieldType.Priority, value: 1 }], 'open-edit', 'row-1')

      expect(m.wrapper.findComponent(BaseListCell).props('editingId')).toBe('row-1')
    })

    it('show-detail-image -> image modal', async () => {
      await emitFromCell([{ key: 'i', type: ListFieldType.ImageFull, value: { imagePath: 'a.png' } }], 'show-detail-image', 'a.png')
      expect(modalSpy).toHaveBeenCalledWith(ModalsId.ImageDetailModal, { imagePath: 'a.png' })
    })

    it('on-remove -> remove modal', async () => {
      await emitFromCell([{ key: 'name', value: 'x' }], 'on-remove', { id: 'row-1' })
      expect(modalSpy).toHaveBeenCalledTimes(1)
    })

    it('on-toggle-status -> updateEntity({ id, isActive: !isActive })', async () => {
      await emitFromCell([{ key: 'name', value: 'x' }], 'on-toggle-status', { id: 'row-1', isActive: true })
      expect(updateEntity).toHaveBeenCalledWith(expect.objectContaining({ data: { form: { id: 'row-1', isActive: false } } }))
    })

    it('on-toggle-status with withDeactivationBySpecificAction -> toggleStatusEntity', async () => {
      const m = await mountRow([{ key: 'name', value: 'x' }], { config: { withDeactivationBySpecificAction: true } })

      m.wrapper.findComponent(BaseListCell).vm.$emit('on-toggle-status', { id: 'row-1', isActive: false })
      await flushPromises()
      expect(toggleStatusEntity).toHaveBeenCalledWith(expect.objectContaining({ data: { form: { id: 'row-1', isActive: true } } }))
      expect(updateEntity).not.toHaveBeenCalled()
    })
  })

  describe('useList() -> row', () => {
    const cells: RowCellDef[] = [{ key: 'name', value: 'x' }, { key: 'actions' }]

    it('fields define td set and order', async () => {
      const m = await mountRow([{ key: 'b', value: 1 }, { key: 'a', value: 2 }, { key: 'c', value: 3 }])
      const keys = m.rowEl.findAll('td').map(td => td.attributes('data-c-field'))

      expect(keys.filter(k => ['a', 'b', 'c'].includes(k!))).toEqual(['b', 'a', 'c'])
      expect(m.cellEl('zzz').exists()).toBe(false)
    })

    it('entityName / pageName define createPageName passed to cell slot', async () => {
      const cap = captureSlot('cell(name)')

      await mountRow([{ key: 'name', value: 'x' }], { extraSlots: { 'cell(name)': cap.slot } })
      expect(cap.props()!.createPageName).toBe('TestCreate')

      const cap2 = captureSlot('cell(name)')

      await mountRow([{ key: 'name', value: 'x' }], { extraSlots: { 'cell(name)': cap2.slot }, useList: { pageName: 'Custom' } })
      expect(cap2.props()!.createPageName).toBe('CustomCreate')
    })

    it('canRemoveCb(item) hides remove item and receives raw row', async () => {
      const canRemoveCb = vi.fn(() => false)
      const m = await mountRow(cells, { useList: { canRemoveCb } })

      expect((await openActionMenu(m)).has('remove')).toBe(false)
      expect(canRemoveCb).toHaveBeenCalledWith(m.row)
      expect((await openActionMenu(await mountRow(cells, { useList: { canRemoveCb: () => true } }))).has('remove')).toBe(true)
    })

    it('canCopyCb(item) hides copy item', async () => {
      const config = { createFromCopy: true }

      expect((await openActionMenu(await mountRow(cells, { config, useList: { canCopyCb: () => false } }))).has('copy')).toBe(false)
      expect((await openActionMenu(await mountRow(cells, { config, useList: { canCopyCb: () => true } }))).has('copy')).toBe(true)
    })

    it('beforeRemoveCallback(item) can block remove modal', async () => {
      vi.clearAllMocks()

      const blocked = await mountRow(cells, { useList: { beforeRemoveCallback: () => false } })

      blocked.wrapper.findComponent(BaseListCell).vm.$emit('on-remove', { id: 'row-1' })
      await flushPromises()
      expect(modalSpy).not.toHaveBeenCalled()

      const allowed = await mountRow(cells, { useList: { beforeRemoveCallback: () => true } })

      allowed.wrapper.findComponent(BaseListCell).vm.$emit('on-remove', { id: 'row-1' })
      await flushPromises()
      expect(modalSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('config -> row', () => {
    it('selectable adds checkbox cell only when canUpdate/canRemove', async () => {
      const cells: RowCellDef[] = [{ key: 'name', value: 'x' }]

      expect((await mountRow(cells, { config: { selectable: true } })).cellEl('selectable').exists()).toBe(true)
      expect((await mountRow(cells)).cellEl('selectable').exists()).toBe(false)

      const noPerm = await mountRow(cells, { config: { selectable: true }, permissions: { canUpdate: false, canRemove: false } })

      expect(noPerm.cellEl('selectable').exists()).toBe(false)
    })

    it('draggable adds drag handle only with canUpdate', async () => {
      const cells: RowCellDef[] = [{ key: 'name', value: 'x' }]

      expect((await mountRow(cells, { config: { draggable: true } })).cellEl('draggable').exists()).toBe(true)
      expect((await mountRow(cells, { config: { draggable: true }, permissions: { canUpdate: false } })).cellEl('draggable').exists()).toBe(false)
      expect((await mountRow(cells)).cellEl('draggable').exists()).toBe(false)
    })

    it('customApiPrefix is forwarded to updateEntity', async () => {
      vi.clearAllMocks()

      const m = await mountRow([{ key: 'p', type: ListFieldType.Priority, value: 1 }], { config: { customApiPrefix: 'custom' } })

      m.wrapper.findComponent(BaseListCell).vm.$emit('edit-position', { id: 'row-1' }, 2)
      await flushPromises()
      expect(updateEntity).toHaveBeenCalledWith(expect.objectContaining({ customApiPrefix: 'custom' }))
    })

    it('row click emits rowClicked with raw row', async () => {
      const m = await mountRow([{ key: 'name', value: 'x' }])

      await m.rowEl.trigger('click')
      expect(m.wrapper.emitted('rowClicked')?.[0]?.[0]).toEqual(m.row)
    })
  })

  it('config.cellCbClass adds class to td', async () => {
    const m = await mountRow([{ key: 'name', value: 'x' }], { config: { cellCbClass: (_item: any, key: string) => `cb-${key}` } })

    expect(m.cellEl('name').classes()).toContain('cb-name')
  })

  it('expand row renders cellExpand slot after toggle (requires cell() slot too)', async () => {
    const m = await mountRow(
      [{ key: 'name', value: 'x' }, { key: 'sub', value: 's', slots: { cell: 'Main sub', cellExpand: 'Expanded sub' } }],
      { expand: { toggleKey: 'name', groups: [{ sub: 'child' }] } },
    )

    expect(m.wrapper.find('[data-c-expand-field="sub"]').exists()).toBe(false)
    await m.toggleExpand()
    expectRow(m)
    expectExpandRow(m)
  })

  it('cellExpand without cell() slot is ignored: expand cell falls back to raw value', async () => {
    const m = await mountRow(
      [{ key: 'name', value: 'x' }, { key: 'sub', value: 's' }],
      { expand: { toggleKey: 'name', groups: [{ sub: 'child' }] }, extraSlots: { 'cellExpand(sub)': () => 'IGNORED' } },
    )

    await m.toggleExpand()
    expect(m.expandCellEl('sub').text()).toContain('child')
    expect(m.expandCellEl('sub').text()).not.toContain('IGNORED')
  })
})
