import { describe, expect, it } from 'vitest'
import { ListFieldType } from '../../../../../../src/@model/templates/tableFields'
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
