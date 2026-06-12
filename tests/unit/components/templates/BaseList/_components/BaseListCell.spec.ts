import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseListCell from '@/components/templates/BaseList/_components/BaseListCell.vue'
import { ListFieldType } from '@/@model/templates/tableFields'
import { BaseListSlots } from '@/@model/templates/baseList'
import type { IBaseListConfig } from '@/@model/templates/baseList'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'

// ─── Stubs ───────────────────────────────────────────────────────────────────

const stubs = {
  StatusField: {
    name: 'StatusField',
    props: ['value'],
    template: '<div data-test-id="status-field" />',
  },
  SumAndCurrency: {
    name: 'SumAndCurrency',
    props: ['align', 'data'],
    template: '<div data-test-id="sum-and-currency" />',
  },
  PillStatusField: {
    name: 'PillStatusField',
    props: ['isActive'],
    template: '<div data-test-id="pill-status-field" />',
  },
  NameWithIdField: {
    name: 'NameWithIdField',
    props: ['item', 'getUpdateRoute', 'getDetailsRoute', 'isShowYou'],
    template: '<div data-test-id="name-with-id-field"><slot /></div>',
  },
  NameWithShortIdField: {
    name: 'NameWithShortIdField',
    props: ['item', 'getUpdateRoute', 'getDetailsRoute', 'isShowYou'],
    template: '<div data-test-id="name-with-short-id-field"><slot /></div>',
  },
  EmailField: {
    name: 'EmailField',
    props: ['item', 'getUpdateRoute'],
    template: '<div data-test-id="email-field" />',
  },
  DateField: {
    name: 'DateField',
    props: ['date'],
    template: '<div data-test-id="date-field" />',
  },
  DateWithSecondsField: {
    name: 'DateWithSecondsField',
    props: ['date'],
    template: '<div data-test-id="date-with-seconds-field" />',
  },
  StatementField: {
    name: 'StatementField',
    props: ['state'],
    template: '<div data-test-id="statement-field" />',
  },
  BadgesField: {
    name: 'BadgesField',
    props: ['listBadges'],
    template: '<div data-test-id="badges-field"><slot /></div>',
  },
  PositionField: {
    name: 'PositionField',
    props: ['id', 'position', 'size', 'canUpdate', 'editingId'],
    emits: ['edit-position', 'open-edit'],
    template: '<div data-test-id="position-field" />',
  },
  ButtonField: {
    name: 'ButtonField',
    props: ['btnName'],
    template: '<div data-test-id="button-field" />',
  },
  CommentField: {
    name: 'CommentField',
    props: ['value'],
    template: '<div data-test-id="comment-field" />',
  },
  ImageField: {
    name: 'ImageField',
    props: ['imagePath', 'size'],
    template: '<div data-test-id="image-field" />',
  },
  ImageDetailField: {
    name: 'ImageDetailField',
    props: ['id', 'imagePath', 'size', 'compressionForPreview'],
    emits: ['show-modal'],
    template: '<div data-test-id="image-detail-field" />',
  },
  DatePeriodField: {
    name: 'DatePeriodField',
    props: ['period'],
    template: '<div data-test-id="date-period-field" />',
  },
  CopyField: {
    name: 'CopyField',
    props: ['value'],
    template: '<div data-test-id="copy-field" />',
  },
  CopyShortField: {
    name: 'CopyShortField',
    props: ['value'],
    template: '<div data-test-id="copy-short-field" />',
  },
  ItemActions: {
    name: 'ItemActions',
    props: [
      'item', 'createPageName', 'detailsPageName', 'canUpdate', 'canCreate',
      'canUpdateSeo', 'canUpdateItem', 'canRemoveItem', 'canCopyItem', 'config', 'getUpdateRoute',
    ],
    emits: ['on-remove', 'on-toggle-status'],
    template: `
      <div data-test-id="item-actions">
        <slot name="${BaseListSlots.PrependActionItem}" />
        <slot name="${BaseListSlots.DetailsActionItem}" />
        <slot name="${BaseListSlots.AppendActionItem}" />
      </div>
    `,
  },
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

const rawItem = {
  id: 'item-1',
  name: 'Test Item',
  currency: 'USD',
  remainder: 500,
  avatar: { imagePath: '/img/avatar.jpg', compressionForPreview: 80 },
}

const makeField = (overrides: Record<string, unknown> = {}) => ({
  key: 'name',
  type: 'unknown-type' as unknown as ListFieldType,
  align: 'left',
  size: 'md',
  ...overrides,
})

const defaultProps = {
  field: makeField(),
  item: { raw: rawItem, value: 'Test Item' },
  cell: 'test-cell-value' as unknown,
  getUpdateRoute: vi.fn(() => ({ name: 'Update', params: { id: rawItem.id } })),
  getDetailsRoute: vi.fn(() => ({ name: 'Details', params: { id: rawItem.id } })),
  isShowYou: false,
  canUpdate: true,
  editingId: null as string | null,
  createPageName: 'TestCreate',
  detailsPageName: 'TestDetails',
  canCreate: true,
  canUpdateSeo: false,
  canUpdateItem: true,
  canRemoveItem: true,
  canCopyItem: true,
  config: {} as IBaseListConfig,
}

const mountCell = (propsOverrides: Record<string, unknown> = {}, slotOverrides: Record<string, string> = {}) =>
  mount(BaseListCell, {
    props: { ...defaultProps, ...propsOverrides } as typeof defaultProps,
    global: { stubs },
    slots: slotOverrides,
  })

const findField = (wrapper: ReturnType<typeof mountCell>, name: string) =>
  wrapper.findComponent({ name })

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('BaseListCell', () => {
  // ── custom-slot ────────────────────────────────────────────────────────────
  describe('custom-slot', () => {
    it('renders custom-slot content when provided', () => {
      const wrapper = mountCell({}, { 'custom-slot': '<span data-test-id="custom-content">Custom</span>' })
      testOn.existElement({ wrapper, testId: 'custom-content' })
    })

    it('wraps custom-slot in span with display: contents style', () => {
      const wrapper = mountCell({}, { 'custom-slot': '<span>content</span>' })
      const span = wrapper.find('span')
      expect(span.attributes('style')).toBe('display: contents;')
    })

    it('does NOT render any field component when custom-slot is provided', () => {
      const wrapper = mountCell(
        { field: makeField({ type: ListFieldType.Status }) },
        { 'custom-slot': '<span>Custom</span>' },
      )
      testOn.notExistElement({ wrapper, testId: 'status-field' })
    })

    it('does NOT render custom-slot wrapper span when slot is not provided', () => {
      const wrapper = mountCell({ field: makeField({ type: ListFieldType.Status }) })
      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('renders the correct field component when no custom-slot provided', () => {
      const wrapper = mountCell({ field: makeField({ type: ListFieldType.Status }) })
      testOn.existElement({ wrapper, testId: 'status-field' })
    })

    it('custom-slot takes priority over any field type', () => {
      for (const type of [ListFieldType.Date, ListFieldType.Badges, ListFieldType.Priority]) {
        const wrapper = mountCell(
          { field: makeField({ type }) },
          { 'custom-slot': '<div data-test-id="overrides-field" />' },
        )
        testOn.existElement({ wrapper, testId: 'overrides-field' })
        testOn.notExistElement({ wrapper, selector: '[data-test-id$="-field"]:not([data-test-id="overrides-field"])' })
      }
    })
  })

  // ── field type rendering ───────────────────────────────────────────────────
  describe('field type rendering', () => {
    describe('Status', () => {
      const field = makeField({ type: ListFieldType.Status })

      it('renders StatusField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'status-field' })
      })

      it('passes cell as :value', () => {
        const cell = 'active'
        expect(findField(mountCell({ field, cell }), 'StatusField').props('value')).toBe(cell)
      })

      it('does NOT render SumAndCurrency', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'sum-and-currency' })
      })

      it('does NOT render default-cell-value wrapper', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), selector: '.default-cell-value' })
      })
    })

    describe('SumAndCurrency', () => {
      const field = makeField({ type: ListFieldType.SumAndCurrency, align: 'right' })

      it('renders SumAndCurrency', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'sum-and-currency' })
      })

      it('passes data with amount=cell, currency and remainder from item.raw', () => {
        const cell = 1500
        expect(findField(mountCell({ field, cell }), 'SumAndCurrency').props('data')).toEqual({
          amount: cell,
          currency: rawItem.currency,
          remainder: rawItem.remainder,
        })
      })

      it('passes align from field', () => {
        expect(findField(mountCell({ field }), 'SumAndCurrency').props('align')).toBe('right')
      })

      it('does NOT render StatusField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'status-field' })
      })
    })

    describe('PillStatus', () => {
      const field = makeField({ type: ListFieldType.PillStatus })

      it('renders PillStatusField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'pill-status-field' })
      })

      it('passes cell as :isActive', () => {
        expect(findField(mountCell({ field, cell: true }), 'PillStatusField').props('isActive')).toBe(true)
      })

      it('passes isActive=false when cell is falsy', () => {
        expect(findField(mountCell({ field, cell: false }), 'PillStatusField').props('isActive')).toBe(false)
      })

      it('does NOT render StatusField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'status-field' })
      })
    })

    describe('NameWithId', () => {
      const field = makeField({ type: ListFieldType.NameWithId })

      it('renders NameWithIdField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'name-with-id-field' })
      })

      it('passes item.raw, getUpdateRoute, getDetailsRoute, isShowYou', () => {
        const wrapper = mountCell({ field, isShowYou: true })
        const nameField = findField(wrapper, 'NameWithIdField')
        expect(nameField.props('item')).toEqual(rawItem)
        expect(nameField.props('isShowYou')).toBe(true)
        expect(typeof nameField.props('getUpdateRoute')).toBe('function')
        expect(typeof nameField.props('getDetailsRoute')).toBe('function')
      })

      it('renders nameWithIdTitle slot content inside NameWithIdField', () => {
        const wrapper = mountCell(
          { field },
          { nameWithIdTitle: '<span data-test-id="name-title">Title</span>' },
        )
        expect(findField(wrapper, 'NameWithIdField').html()).toContain('data-test-id="name-title"')
      })

      it('does NOT render NameWithShortIdField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'name-with-short-id-field' })
      })
    })

    describe('NameWithShortId', () => {
      const field = makeField({ type: ListFieldType.NameWithShortId })

      it('renders NameWithShortIdField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'name-with-short-id-field' })
      })

      it('renders nameWithIdTitle slot content inside NameWithShortIdField', () => {
        const wrapper = mountCell(
          { field },
          { nameWithIdTitle: '<span data-test-id="short-name-title">Title</span>' },
        )
        expect(findField(wrapper, 'NameWithShortIdField').html()).toContain('data-test-id="short-name-title"')
      })

      it('does NOT render NameWithIdField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'name-with-id-field' })
      })
    })

    describe('Email', () => {
      const field = makeField({ type: ListFieldType.Email })

      it('renders EmailField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'email-field' })
      })

      it('passes item.raw and getUpdateRoute', () => {
        const emailField = findField(mountCell({ field }), 'EmailField')
        expect(emailField.props('item')).toEqual(rawItem)
        expect(typeof emailField.props('getUpdateRoute')).toBe('function')
      })

      it('does NOT render DateField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'date-field' })
      })
    })

    describe('Date', () => {
      const field = makeField({ type: ListFieldType.Date })

      it('renders DateField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'date-field' })
      })

      it('passes cell as :date', () => {
        const cell = '2024-06-12'
        expect(findField(mountCell({ field, cell }), 'DateField').props('date')).toBe(cell)
      })

      it('does NOT render DateWithSecondsField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'date-with-seconds-field' })
      })
    })

    describe('DateWithSeconds', () => {
      const field = makeField({ type: ListFieldType.DateWithSeconds })

      it('renders DateWithSecondsField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'date-with-seconds-field' })
      })

      it('passes cell as :date', () => {
        const cell = '2024-06-12T10:30:00'
        expect(findField(mountCell({ field, cell }), 'DateWithSecondsField').props('date')).toBe(cell)
      })

      it('does NOT render DateField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'date-field' })
      })
    })

    describe('Statement', () => {
      const field = makeField({ type: ListFieldType.Statement })

      it('renders StatementField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'statement-field' })
      })

      it('passes cell as :state', () => {
        expect(findField(mountCell({ field, cell: 'pending' }), 'StatementField').props('state')).toBe('pending')
      })
    })

    describe('Badges', () => {
      const field = makeField({ type: ListFieldType.Badges })

      it('renders BadgesField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'badges-field' })
      })

      it('passes cell as :listBadges', () => {
        const cell = ['tag1', 'tag2']
        expect(findField(mountCell({ field, cell }), 'BadgesField').props('listBadges')).toEqual(cell)
      })

      it('renders badgeTitle slot content inside BadgesField', () => {
        const wrapper = mountCell(
          { field },
          { badgeTitle: '<span data-test-id="badge-title">Label</span>' },
        )
        expect(findField(wrapper, 'BadgesField').html()).toContain('data-test-id="badge-title"')
      })

      it('does NOT render StatusField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'status-field' })
      })
    })

    describe('Priority → PositionField', () => {
      const field = makeField({ type: ListFieldType.Priority })

      it('renders PositionField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'position-field' })
      })

      it('passes id from item.raw.id', () => {
        expect(findField(mountCell({ field }), 'PositionField').props('id')).toBe(rawItem.id)
      })

      it('passes cell as :position', () => {
        expect(findField(mountCell({ field, cell: 5 }), 'PositionField').props('position')).toBe(5)
      })

      it('passes canUpdate', () => {
        expect(findField(mountCell({ field, canUpdate: false }), 'PositionField').props('canUpdate')).toBe(false)
      })

      it('passes editingId', () => {
        expect(findField(mountCell({ field, editingId: 'item-1' }), 'PositionField').props('editingId')).toBe('item-1')
      })

      it('passes editingId=null when not editing', () => {
        expect(findField(mountCell({ field, editingId: null }), 'PositionField').props('editingId')).toBeNull()
      })

      it('passes field.size', () => {
        expect(findField(mountCell({ field: makeField({ type: ListFieldType.Priority, size: 'lg' }) }), 'PositionField').props('size')).toBe('lg')
      })

      it('does NOT render ButtonField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'button-field' })
      })
    })

    describe('Button', () => {
      const field = makeField({ type: ListFieldType.Button })

      it('renders ButtonField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'button-field' })
      })

      it('passes cell as :btnName', () => {
        expect(findField(mountCell({ field, cell: 'Click me' }), 'ButtonField').props('btnName')).toBe('Click me')
      })

      it('does NOT render CommentField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'comment-field' })
      })
    })

    describe('Comment', () => {
      const field = makeField({ type: ListFieldType.Comment })

      it('renders CommentField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'comment-field' })
      })

      it('passes cell as :value', () => {
        expect(findField(mountCell({ field, cell: 'A comment' }), 'CommentField').props('value')).toBe('A comment')
      })
    })

    describe('Image', () => {
      const field = makeField({ type: ListFieldType.Image, size: 'sm' })

      it('renders ImageField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'image-field' })
      })

      it('passes cell as :imagePath and field.size', () => {
        const wrapper = mountCell({ field, cell: '/img/test.jpg' })
        const imageField = findField(wrapper, 'ImageField')
        expect(imageField.props('imagePath')).toBe('/img/test.jpg')
        expect(imageField.props('size')).toBe('sm')
      })

      it('does NOT render ImageDetailField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'image-detail-field' })
      })
    })

    describe('ImageFull', () => {
      const field = makeField({ type: ListFieldType.ImageFull, key: 'avatar' })

      it('renders ImageDetailField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'image-detail-field' })
      })

      it('passes imagePath from item.raw[field.key]', () => {
        expect(findField(mountCell({ field }), 'ImageDetailField').props('imagePath')).toBe(rawItem.avatar.imagePath)
      })

      it('passes compressionForPreview from item.raw[field.key]', () => {
        expect(findField(mountCell({ field }), 'ImageDetailField').props('compressionForPreview')).toBe(rawItem.avatar.compressionForPreview)
      })

      it('falls back to compressionForPreview=0 when property is missing', () => {
        const item = { raw: { id: '1', avatar: { imagePath: '/img.jpg' } }, value: null }
        expect(findField(mountCell({ field, item }), 'ImageDetailField').props('compressionForPreview')).toBe(0)
      })

      it('passes item.raw.id as :id', () => {
        expect(findField(mountCell({ field }), 'ImageDetailField').props('id')).toBe(rawItem.id)
      })

      it('does NOT render ImageField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'image-field' })
      })
    })

    describe('Period', () => {
      const field = makeField({ type: ListFieldType.Period })

      it('renders DatePeriodField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'date-period-field' })
      })

      it('passes cell as :period', () => {
        const cell = { from: '2024-01-01', to: '2024-01-31' }
        expect(findField(mountCell({ field, cell }), 'DatePeriodField').props('period')).toEqual(cell)
      })
    })

    describe('Copy', () => {
      const field = makeField({ type: ListFieldType.Copy })

      it('renders CopyField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'copy-field' })
      })

      it('passes cell as :value', () => {
        expect(findField(mountCell({ field, cell: 'copy-this' }), 'CopyField').props('value')).toBe('copy-this')
      })

      it('does NOT render CopyShortField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'copy-short-field' })
      })
    })

    describe('CopyShort', () => {
      const field = makeField({ type: ListFieldType.CopyShort })

      it('renders CopyShortField', () => {
        testOn.existElement({ wrapper: mountCell({ field }), testId: 'copy-short-field' })
      })

      it('passes cell as :value', () => {
        expect(findField(mountCell({ field, cell: 'short' }), 'CopyShortField').props('value')).toBe('short')
      })

      it('does NOT render CopyField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'copy-field' })
      })
    })

    describe('Percent', () => {
      const field = makeField({ type: ListFieldType.Percent })

      it('renders cell value with % suffix', () => {
        expect(mountCell({ field, cell: 42 }).text()).toContain('42 %')
      })

      it('renders 0 % when cell is 0', () => {
        expect(mountCell({ field, cell: 0 }).text()).toContain('0 %')
      })

      it('does NOT render default-cell-value wrapper', () => {
        testOn.notExistElement({ wrapper: mountCell({ field, cell: 10 }), selector: '.default-cell-value' })
      })

      it('does NOT render StatusField', () => {
        testOn.notExistElement({ wrapper: mountCell({ field }), testId: 'status-field' })
      })
    })

    describe('unknown / fallback type', () => {
      const field = makeField({ type: 'unknown-type' as unknown as ListFieldType })

      it('renders div.default-cell-value', () => {
        testOn.existElement({ wrapper: mountCell({ field }), selector: '.default-cell-value' })
      })

      it('renders cell value inside .default-cell-value', () => {
        expect(mountCell({ field, cell: 'fallback text' }).find('.default-cell-value').text()).toBe('fallback text')
      })

      it('renders empty string cell without errors', () => {
        const wrapper = mountCell({ field, cell: '' })
        testOn.existElement({ wrapper, selector: '.default-cell-value' })
        expect(wrapper.find('.default-cell-value').text()).toBe('')
      })

      it('does NOT render any known field component', () => {
        const wrapper = mountCell({ field })
        const knownTestIds = ['status-field', 'sum-and-currency', 'pill-status-field',
          'name-with-id-field', 'email-field', 'date-field', 'badges-field', 'position-field']
        knownTestIds.forEach(testId => testOn.notExistElement({ wrapper, testId }))
      })
    })
  })

  // ── ItemActions ────────────────────────────────────────────────────────────
  describe('ItemActions', () => {
    const actionsField = makeField({ key: 'actions' })
    const nonActionsField = makeField({ key: 'name' })

    describe('rendering condition', () => {
      it('renders ItemActions when field.key === "actions"', () => {
        testOn.existElement({ wrapper: mountCell({ field: actionsField }), testId: 'item-actions' })
      })

      it('does NOT render ItemActions when field.key !== "actions"', () => {
        testOn.notExistElement({ wrapper: mountCell({ field: nonActionsField }), testId: 'item-actions' })
      })

      it('renders ItemActions alongside any field type when key is "actions"', () => {
        const wrapper = mountCell({ field: makeField({ key: 'actions', type: ListFieldType.Status }) })
        testOn.existElement({ wrapper, testId: 'status-field' })
        testOn.existElement({ wrapper, testId: 'item-actions' })
      })

      it('does NOT render ItemActions for "action" (typo) key', () => {
        testOn.notExistElement({ wrapper: mountCell({ field: makeField({ key: 'action' }) }), testId: 'item-actions' })
      })
    })

    describe('props', () => {
      it('passes item.raw as :item', () => {
        expect(findField(mountCell({ field: actionsField }), 'ItemActions').props('item')).toEqual(rawItem)
      })

      it('passes createPageName and detailsPageName', () => {
        const wrapper = mountCell({ field: actionsField, createPageName: 'MyCreate', detailsPageName: 'MyDetails' })
        const itemActions = findField(wrapper, 'ItemActions')
        expect(itemActions.props('createPageName')).toBe('MyCreate')
        expect(itemActions.props('detailsPageName')).toBe('MyDetails')
      })

      it('passes all permission props', () => {
        const wrapper = mountCell({
          field: actionsField,
          canUpdate: false,
          canCreate: false,
          canUpdateSeo: true,
          canUpdateItem: false,
          canRemoveItem: false,
          canCopyItem: false,
        })
        const itemActions = findField(wrapper, 'ItemActions')
        expect(itemActions.props('canUpdate')).toBe(false)
        expect(itemActions.props('canCreate')).toBe(false)
        expect(itemActions.props('canUpdateSeo')).toBe(true)
        expect(itemActions.props('canUpdateItem')).toBe(false)
        expect(itemActions.props('canRemoveItem')).toBe(false)
        expect(itemActions.props('canCopyItem')).toBe(false)
      })

      it('passes getUpdateRoute function', () => {
        expect(typeof findField(mountCell({ field: actionsField }), 'ItemActions').props('getUpdateRoute')).toBe('function')
      })
    })

    describe('prependActionItem slot', () => {
      it('renders prependActionItem slot content in ItemActions when provided', () => {
        const wrapper = mountCell(
          { field: actionsField },
          { prependActionItem: '<div data-test-id="prepend-content">Prepend</div>' },
        )
        testOn.existElement({ wrapper, testId: 'prepend-content' })
      })

      it('does NOT render prependActionItem content when slot is not provided', () => {
        testOn.notExistElement({ wrapper: mountCell({ field: actionsField }), testId: 'prepend-content' })
      })
    })

    describe('detailsActionItem slot', () => {
      it('renders detailsActionItem slot content when provided', () => {
        const wrapper = mountCell(
          { field: actionsField },
          { detailsActionItem: '<div data-test-id="details-content">Details</div>' },
        )
        testOn.existElement({ wrapper, testId: 'details-content' })
      })

      it('does not break when detailsActionItem slot is not provided (template always present)', () => {
        // detailsActionItem has no v-if — template is always passed to ItemActions
        const wrapper = mountCell({ field: actionsField })
        testOn.existElement({ wrapper, testId: 'item-actions' })
      })
    })

    describe('appendActionItem slot', () => {
      it('renders appendActionItem slot content in ItemActions when provided', () => {
        const wrapper = mountCell(
          { field: actionsField },
          { appendActionItem: '<div data-test-id="append-content">Append</div>' },
        )
        testOn.existElement({ wrapper, testId: 'append-content' })
      })

      it('does NOT render appendActionItem content when slot is not provided', () => {
        testOn.notExistElement({ wrapper: mountCell({ field: actionsField }), testId: 'append-content' })
      })
    })

    describe('emits', () => {
      it('emits "on-remove" when ItemActions emits on-remove', async () => {
        const wrapper = mountCell({ field: actionsField })
        await findField(wrapper, 'ItemActions').vm.$emit('on-remove', rawItem)
        expect(wrapper.emitted('on-remove')?.[0]).toEqual([rawItem])
      })

      it('emits "on-toggle-status" when ItemActions emits on-toggle-status', async () => {
        const wrapper = mountCell({ field: actionsField })
        await findField(wrapper, 'ItemActions').vm.$emit('on-toggle-status', rawItem)
        expect(wrapper.emitted('on-toggle-status')?.[0]).toEqual([rawItem])
      })

      it('does NOT emit "on-remove" without interaction', () => {
        expect(mountCell({ field: actionsField }).emitted('on-remove')).toBeUndefined()
      })

      it('does NOT emit "on-toggle-status" without interaction', () => {
        expect(mountCell({ field: actionsField }).emitted('on-toggle-status')).toBeUndefined()
      })
    })
  })

  // ── emits ──────────────────────────────────────────────────────────────────
  describe('events', () => {
    describe('edit-position from PositionField', () => {
      const field = makeField({ type: ListFieldType.Priority })

      it('emits "edit-position" with [item.raw, val]', async () => {
        const wrapper = mountCell({ field })
        await findField(wrapper, 'PositionField').vm.$emit('edit-position', 3)
        expect(wrapper.emitted('edit-position')?.[0]).toEqual([rawItem, 3])
      })

      it('emits "edit-position" with correct val on multiple calls', async () => {
        const wrapper = mountCell({ field })
        await findField(wrapper, 'PositionField').vm.$emit('edit-position', 1)
        await findField(wrapper, 'PositionField').vm.$emit('edit-position', 99)
        expect(wrapper.emitted('edit-position')?.[1]).toEqual([rawItem, 99])
      })

      it('does NOT emit "edit-position" before PositionField fires', () => {
        expect(mountCell({ field }).emitted('edit-position')).toBeUndefined()
      })
    })

    describe('open-edit from PositionField', () => {
      const field = makeField({ type: ListFieldType.Priority })

      it('emits "open-edit" with item.raw.id', async () => {
        const wrapper = mountCell({ field })
        await findField(wrapper, 'PositionField').vm.$emit('open-edit')
        expect(wrapper.emitted('open-edit')?.[0]).toEqual([rawItem.id])
      })

      it('does NOT emit "open-edit" before PositionField fires', () => {
        expect(mountCell({ field }).emitted('open-edit')).toBeUndefined()
      })
    })

    describe('show-detail-image from ImageDetailField', () => {
      const field = makeField({ type: ListFieldType.ImageFull, key: 'avatar' })

      it('emits "show-detail-image" with imagePath from show-modal', async () => {
        const wrapper = mountCell({ field })
        await findField(wrapper, 'ImageDetailField').vm.$emit('show-modal', '/img/detail.jpg')
        expect(wrapper.emitted('show-detail-image')?.[0]).toEqual(['/img/detail.jpg'])
      })

      it('does NOT emit "show-detail-image" before ImageDetailField fires', () => {
        expect(mountCell({ field }).emitted('show-detail-image')).toBeUndefined()
      })
    })
  })
})
