<script>
import { BTable } from 'bootstrap-vue'
import { defineComponent } from 'vue'
import { pluckProps } from 'bootstrap-vue/src/utils/props'
import { BTbody, props as BTbodyProps } from 'bootstrap-vue/src/components/table/tbody'

import { SLOT_NAME_THEAD_TOP } from 'bootstrap-vue/src/constants/slots'
import { EVENT_NAME_HEAD_CLICKED } from 'bootstrap-vue/src/constants/events'
import { CODE_ENTER, CODE_SPACE } from 'bootstrap-vue/src/constants/key-codes'

import { EVENT_NAME_ROW_CLICKED } from 'bootstrap-vue/src/constants/events'
import { SLOT_NAME_ROW_DETAILS } from 'bootstrap-vue/src/constants/slots'

import { get } from 'bootstrap-vue/src/utils/get'
import { isFunction } from 'bootstrap-vue/src/utils/inspect'
import { toString } from 'bootstrap-vue/src/utils/string'
import { isUndefinedOrNull } from 'bootstrap-vue/src/utils/inspect'
import { noop } from 'bootstrap-vue/src/utils/noop'
import { htmlOrText } from 'bootstrap-vue/src/utils/html'
import { identity } from 'bootstrap-vue/src/utils/identity'
import { startCase } from 'bootstrap-vue/src/utils/string'

import { BTr } from 'bootstrap-vue/src/components/table/tr'
import { BTd } from 'bootstrap-vue/src/components/table/td'
import { BTfoot } from 'bootstrap-vue/src/components/table/tfoot'
import { BTh } from 'bootstrap-vue/src/components/table/th'
import { BThead } from 'bootstrap-vue/src/components/table/thead'

import {
  FIELD_KEY_CELL_VARIANT,
  FIELD_KEY_ROW_VARIANT,
  FIELD_KEY_SHOW_DETAILS,
} from 'bootstrap-vue/src/constants/config.js'

import draggable from 'vuedraggable'
const getHeadSlotName = (value) => `head(${value || ''})`
const getFootSlotName = (value) => `foot(${value || ''})`

const getCellSlotName = (value) => `cell(${value || ''})`

export default defineComponent({
  name: 'CTable',
  extends: BTable,
  props: {
    draggable: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDragMode() {
      return this.$props?.draggable
    },
  },
  watch: {
    localBusy: {
      handler() {
        if (this.localBusy) {
          // You need to clear the array to remove the wrong position of the lines created by the drag and drop
          // Elements populate by themselves after updating the table
          this.localItems = []
        }
      },
    },
  },
  methods: {
    //region Base renderTbody from node_modules/bootstrap-vue/src/components/table/helpers/mixin-tbody.js
    renderTbody() {
      const {
        computedItems: items,
        hasListener,
        renderBusy,
        renderTopRow,
        renderEmpty,
        renderBottomRow,
        renderThead,
      } = this
      const h = this.$createElement
      const hasRowClickHandler = hasListener(EVENT_NAME_ROW_CLICKED) && !this.hasSelectableRowClick
      const $rows = []
      const $busy = renderBusy ? renderBusy() : null

      if ($busy) {
        $rows.push($busy)
      } else {
        const cache = {}
        let defaultSlotName = getCellSlotName()
        defaultSlotName = this.hasNormalizedSlot(defaultSlotName) ? defaultSlotName : null
        this.computedFields.forEach((field) => {
          const { key } = field
          const slotName = getCellSlotName(key)
          const lowercaseSlotName = getCellSlotName(key.toLowerCase())
          cache[key] = this.hasNormalizedSlot(slotName)
            ? slotName
            : this.hasNormalizedSlot(lowercaseSlotName)
            ? lowercaseSlotName
            : defaultSlotName
        })
        this.$_bodyFieldSlotNameCache = cache
        $rows.push(renderTopRow ? renderTopRow() : h())

        items.forEach((item, rowIndex) => {
          $rows.push(this.renderTbodyRow(item, rowIndex))
        })

        $rows.push(renderEmpty ? renderEmpty() : h())
        $rows.push(renderBottomRow ? renderBottomRow() : h())
      }

      const handlers = {
        auxclick: this.onTbodyRowMiddleMouseRowClicked,
        contextmenu: this.onTbodyRowContextmenu,
        dblclick: this.onTbodyRowDblClicked,
      }
      if (hasRowClickHandler) {
        handlers.click = this.onTBodyRowClicked
        handlers.keydown = this.onTbodyRowKeydown
      }
      //endregion

      handlers.end = (e) => {
        this.$emit('end', e)
      }
      // >>> Start Extended Functionality
      const $tbody = h(
        this.isDragMode ? draggable : BTbody,
        {
          class: this.tbodyClass || '',
          props: pluckProps(BTbodyProps, this.$props),
          attrs: { tag: 'tbody', draggable: this.isDragMode ? '.item_tr' : false },
          on: handlers,
          ref: 'tbody',
        },
        $rows
      )
      // >>> End Extended Functionality
      return $tbody
    },

    // Renders a TD or TH for a row's field
    renderTbodyRowCell(field, colIndex, item, rowIndex) {
      const { isStacked } = this
      const { key, label, isRowHeader } = field
      const h = this.$createElement
      const hasDetailsSlot = this.hasNormalizedSlot(SLOT_NAME_ROW_DETAILS)
      const formatted = this.getFormattedValue(item, field)
      const stickyColumn =
        !isStacked && (this.isResponsive || this.stickyHeader) && field.stickyColumn
      // We only uses the helper components for sticky columns to
      // improve performance of BTable/BTableLite by reducing the
      // total number of vue instances created during render
      const cellTag = stickyColumn ? (isRowHeader ? BTh : BTd) : isRowHeader ? 'th' : 'td'
      const cellVariant =
        item[FIELD_KEY_CELL_VARIANT] && item[FIELD_KEY_CELL_VARIANT][key]
          ? item[FIELD_KEY_CELL_VARIANT][key]
          : field.variant || null
      const data = {
        // For the Vue key, we concatenate the column index and
        // field key (as field keys could be duplicated)
        // TODO: Although we do prevent duplicate field keys...
        //   So we could change this to: `row-${rowIndex}-cell-${key}`
        class: [field.class ? field.class : '', this.getTdValues(item, key, field.tdClass, '')],
        props: {},
        attrs: {
          'aria-colindex': String(colIndex + 1),
          ...(isRowHeader
            ? this.getThValues(item, key, field.thAttr, 'row', {})
            : this.getTdValues(item, key, field.tdAttr, {})),
        },
        key: `row-${rowIndex}-cell-${colIndex}-${key}`,
      }
      if (stickyColumn) {
        // We are using the helper BTd or BTh
        data.props = {
          stackedHeading: isStacked ? label : null,
          stickyColumn: true,
          variant: cellVariant,
        }
      } else {
        // Using native TD or TH element, so we need to
        // add in the attributes and variant class
        data.attrs['data-label'] = isStacked && !isUndefinedOrNull(label) ? toString(label) : null
        data.attrs.role = isRowHeader ? 'rowheader' : 'cell'
        data.attrs.scope = isRowHeader ? 'row' : null
        data.attrs['data-c-field'] = field.key
        // Add in the variant class
        if (cellVariant) {
          data.class.push(`${this.dark ? 'bg' : 'table'}-${cellVariant}`)
        }
      }

      const slotScope = {
        item,
        index: rowIndex,
        field,
        unformatted: get(item, key, ''),
        value: formatted,
        toggleDetails: this.toggleDetailsFactory(hasDetailsSlot, item),
        detailsShowing: Boolean(item[FIELD_KEY_SHOW_DETAILS]),
      }
      // If table supports selectable mode, then add in the following scope
      // this.supportsSelectableRows will be undefined if mixin isn't loaded
      if (this.supportsSelectableRows) {
        slotScope.rowSelected = this.isRowSelected(rowIndex)
        slotScope.selectRow = () => this.selectRow(rowIndex)
        slotScope.unselectRow = () => this.unselectRow(rowIndex)
      }

      // The new `v-slot` syntax doesn't like a slot name starting with
      // a square bracket and if using in-document HTML templates, the
      // v-slot attributes are lower-cased by the browser.
      // Switched to round bracket syntax to prevent confusion with
      // dynamic slot name syntax.
      // We look for slots in this order: `cell(${key})`, `cell(${key.toLowerCase()})`, 'cell()'
      // Slot names are now cached by mixin tbody in `this.$_bodyFieldSlotNameCache`
      // Will be `null` if no slot (or fallback slot) exists
      const slotName = this.$_bodyFieldSlotNameCache[key]
      let $childNodes = slotName ? this.normalizeSlot(slotName, slotScope) : toString(formatted)

      if (this.isStacked) {
        // We wrap in a DIV to ensure rendered as a single cell when visually stacked!
        $childNodes = [h('div', [$childNodes])]
      }
      // Render either a td or th cell
      // >>> Start Extended Functionality
      const content =
        '<svg data-v-53380294="" xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="draggable-task-handle d-inline feather feather-more-vertical"><circle data-v-53380294="" cx="12" cy="12" r="1"></circle><circle data-v-53380294="" cx="12" cy="5" r="1"></circle><circle data-v-53380294="" cx="12" cy="19" r="1"></circle></svg>'

      if (this.isDragMode && colIndex === 0) {
        return h(cellTag, data, [
          h('div', {
            domProps: { innerHTML: content },
            class: 'cursor-move item_td_draggable_hover',
          }),
          $childNodes,
        ])
      }
      // >>> End Extended Functionality
      return h(cellTag, data, [$childNodes])
    },
    renderTbodyRow(item, rowIndex) {
      const {
        computedFields: fields,
        striped,
        primaryKey,
        currentPage,
        perPage,
        tbodyTrClass,
        tbodyTrAttr,
      } = this
      const h = this.$createElement
      const hasDetailsSlot = this.hasNormalizedSlot(SLOT_NAME_ROW_DETAILS)
      const rowShowDetails = item[FIELD_KEY_SHOW_DETAILS] && hasDetailsSlot
      const hasRowClickHandler =
        this.$listeners[EVENT_NAME_ROW_CLICKED] || this.hasSelectableRowClick
      // We can return more than one TR if rowDetails enabled
      const $rows = []

      // Details ID needed for `aria-details` when details showing
      // We set it to `null` when not showing so that attribute
      // does not appear on the element
      const detailsId = rowShowDetails ? this.safeId(`_details_${rowIndex}_`) : null

      // For each item data field in row
      const $tds = fields.map((field, colIndex) => {
        return this.renderTbodyRowCell(field, colIndex, item, rowIndex)
      })

      // Calculate the row number in the dataset (indexed from 1)
      let ariaRowIndex = null
      if (currentPage && perPage && perPage > 0) {
        ariaRowIndex = String((currentPage - 1) * perPage + rowIndex + 1)
      }

      // Create a unique :key to help ensure that sub components are re-rendered rather than
      // re-used, which can cause issues. If a primary key is not provided we use the rendered
      // rows index within the tbody.
      // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/2410
      const primaryKeyValue = toString(get(item, primaryKey)) || null
      const rowKey = primaryKeyValue || toString(rowIndex)

      // If primary key is provided, use it to generate a unique ID on each tbody > tr
      // In the format of '{tableId}__row_{primaryKeyValue}'
      const rowId = primaryKeyValue ? this.safeId(`_row_${primaryKeyValue}`) : null

      // Selectable classes and attributes
      const selectableClasses = this.selectableRowClasses ? this.selectableRowClasses(rowIndex) : {}
      const selectableAttrs = this.selectableRowAttrs ? this.selectableRowAttrs(rowIndex) : {}

      // Additional classes and attributes
      const userTrClasses = isFunction(tbodyTrClass) ? tbodyTrClass(item, 'row') : tbodyTrClass
      const userTrAttrs = isFunction(tbodyTrAttr)
        ? /* istanbul ignore next */ tbodyTrAttr(item, 'row')
        : tbodyTrAttr

      // Add the item row
      const classBTr = [
        userTrClasses,
        selectableClasses,
        rowShowDetails ? 'b-table-has-details' : '',
      ]

      // >>> Start Extended Functionality
      if (this.isDragMode) {
        if (classBTr[0]) {
          classBTr[0] += ' item_tr'
        } else {
          classBTr[0] = 'item_tr'
        }
      }

      if (this.isDragMode && $tds[0]) {
        if ($tds[0].data.class) {
          $tds[0].data.class += ' item_td_draggable'
        } else {
          $tds[0].data.class = 'item_td_draggable'
        }
      }
      // >>> End Extended Functionality
      $rows.push(
        h(
          BTr,
          {
            class: `${classBTr} ${this.hover ? 'is-hover-row' : ''}`,
            props: { variant: item.rowVariant },
            attrs: {
              id: rowId,
              ...userTrAttrs,
              // Users cannot override the following attributes
              tabindex: hasRowClickHandler ? '0' : null,
              'data-pk': primaryKeyValue || null,
              'aria-details': detailsId,
              'aria-owns': detailsId,
              'aria-rowindex': ariaRowIndex,
              ...selectableAttrs,
            },
            on: {
              // Note: These events are not A11Y friendly!
              mouseenter: this.rowHovered,
              mouseleave: this.rowUnhovered,
            },
            key: `__b-table-row-${rowKey}__`,
            ref: 'item-rows',
            refInFor: true,
          },
          $tds
        )
      )

      // Row Details slot
      if (rowShowDetails) {
        const detailsScope = {
          item,
          index: rowIndex,
          fields,
          toggleDetails: this.toggleDetailsFactory(hasDetailsSlot, item),
        }
        // If table supports selectable mode, then add in the following scope
        // this.supportsSelectableRows will be undefined if mixin isn't loaded
        if (this.supportsSelectableRows) {
          detailsScope.rowSelected = this.isRowSelected(rowIndex)
          detailsScope.selectRow = () => this.selectRow(rowIndex)
          detailsScope.unselectRow = () => this.unselectRow(rowIndex)
        }

        // Render the details slot in a TD
        const $details = h(
          BTd,
          {
            props: { colspan: fields.length },
            class: this.detailsTdClass,
          },
          [this.normalizeSlot(SLOT_NAME_ROW_DETAILS, detailsScope)]
        )

        // Add a hidden row to keep table row striping consistent when details showing
        // Only added if the table is striped
        if (striped) {
          $rows.push(
            // We don't use `BTr` here as we don't need the extra functionality
            h('tr', {
              staticClass: 'd-none',
              attrs: {
                'aria-hidden': 'true',
                role: 'presentation',
              },
              key: `__b-table-details-stripe__${rowKey}`,
            })
          )
        }

        // Add the actual details row
        const userDetailsTrClasses = isFunction(this.tbodyTrClass)
          ? /* istanbul ignore next */ this.tbodyTrClass(item, SLOT_NAME_ROW_DETAILS)
          : this.tbodyTrClass
        const userDetailsTrAttrs = isFunction(this.tbodyTrAttr)
          ? /* istanbul ignore next */ this.tbodyTrAttr(item, SLOT_NAME_ROW_DETAILS)
          : this.tbodyTrAttr
        $rows.push(
          h(
            BTr,
            {
              staticClass: 'b-table-details',
              class: [userDetailsTrClasses],
              props: { variant: item[FIELD_KEY_ROW_VARIANT] || null },
              attrs: {
                ...userDetailsTrAttrs,
                // Users cannot override the following attributes
                id: detailsId,
                tabindex: '-1',
              },
              key: `__b-table-details__${rowKey}`,
            },
            [$details]
          )
        )
      } else if (hasDetailsSlot) {
        // Only add the placeholder if a the table has a row-details slot defined (but not shown)
        $rows.push(h())
        if (striped) {
          // Add extra placeholder if table is striped
          $rows.push(h())
        }
      }

      // Return the row(s)
      return $rows
    },

    renderThead(isFoot = false) {
      const {
        computedFields: fields,
        isSortable,
        isSelectable,
        headVariant,
        footVariant,
        headRowVariant,
        footRowVariant,
      } = this
      const h = this.$createElement

      // In always stacked mode, we don't bother rendering the head/foot
      // Or if no field headings (empty table)
      if (this.isStackedAlways || fields.length === 0) {
        return h()
      }

      const hasHeadClickListener = isSortable || this.hasListener(EVENT_NAME_HEAD_CLICKED)

      // Reference to `selectAllRows` and `clearSelected()`, if table is selectable
      const selectAllRows = isSelectable ? this.selectAllRows : noop
      const clearSelected = isSelectable ? this.clearSelected : noop

      // Helper function to generate a field <th> cell
      const makeCell = (field, colIndex) => {
        const { label, labelHtml, variant, stickyColumn, key } = field

        let ariaLabel = null
        if (!field.label.trim() && !field.headerTitle) {
          // In case field's label and title are empty/blank
          // We need to add a hint about what the column is about for non-sighted users
          /* istanbul ignore next */
          ariaLabel = startCase(field.key)
        }

        const on = {}
        if (hasHeadClickListener) {
          on.click = (event) => {
            this.headClicked(event, field, isFoot)
          }
          on.keydown = (event) => {
            const keyCode = event.keyCode
            if (keyCode === CODE_ENTER || keyCode === CODE_SPACE) {
              this.headClicked(event, field, isFoot)
            }
          }
        }

        const sortAttrs = isSortable ? this.sortTheadThAttrs(key, field, isFoot) : {}
        const sortClass = isSortable ? this.sortTheadThClasses(key, field, isFoot) : null
        const sortLabel = isSortable ? this.sortTheadThLabel(key, field, isFoot) : null

        const data = {
          class: [this.fieldClasses(field), sortClass],
          props: { variant, stickyColumn },
          style: field.thStyle || {},
          attrs: {
            // We only add a `tabindex` of `0` if there is a head-clicked listener
            // and the current field is sortable
            tabindex: hasHeadClickListener && field.sortable ? '0' : null,
            abbr: field.headerAbbr || null,
            title: field.headerTitle || null,
            'aria-colindex': colIndex + 1,
            'aria-label': ariaLabel,
            'data-c-field': field.key, // added custom attribute for quick and easy styling override
            ...this.getThValues(null, key, field.thAttr, isFoot ? 'foot' : 'head', {}),
            ...sortAttrs,
          },
          on,
          key,
        }

        // Handle edge case where in-document templates are used with new
        // `v-slot:name` syntax where the browser lower-cases the v-slot's
        // name (attributes become lower cased when parsed by the browser)
        // We have replaced the square bracket syntax with round brackets
        // to prevent confusion with dynamic slot names
        let slotNames = [
          getHeadSlotName(key),
          getHeadSlotName(key.toLowerCase()),
          getHeadSlotName(),
        ]
        // Footer will fallback to header slot names
        if (isFoot) {
          slotNames = [
            getFootSlotName(key),
            getFootSlotName(key.toLowerCase()),
            getFootSlotName(),
            ...slotNames,
          ]
        }

        const scope = {
          label,
          column: key,
          field,
          isFoot,
          // Add in row select methods
          selectAllRows,
          clearSelected,
        }

        const $content =
          this.normalizeSlot(slotNames, scope) ||
          h('div', { domProps: htmlOrText(labelHtml, label) })

        const $srLabel = sortLabel ? h('span', { staticClass: 'sr-only' }, ` (${sortLabel})`) : null

        // Return the header cell
        return h(BTh, data, [$content, $srLabel].filter(identity))
      }

      // Generate the array of <th> cells
      const $cells = fields.map(makeCell).filter(identity)

      // Generate the row(s)
      const $trs = []
      if (isFoot) {
        $trs.push(
          h(
            BTr,
            {
              class: this.tfootTrClass,
              props: {
                variant: isUndefinedOrNull(footRowVariant)
                  ? headRowVariant
                  : /* istanbul ignore next */ footRowVariant,
              },
            },
            $cells
          )
        )
      } else {
        const scope = {
          columns: fields.length,
          fields,
          // Add in row select methods
          selectAllRows,
          clearSelected,
        }
        $trs.push(this.normalizeSlot(SLOT_NAME_THEAD_TOP, scope) || h())

        $trs.push(
          h(
            BTr,
            {
              class: this.theadTrClass,
              props: { variant: headRowVariant },
            },
            $cells
          )
        )
      }

      return h(
        isFoot ? BTfoot : BThead,
        {
          class: (isFoot ? this.tfootClass : this.theadClass) || null,
          props: isFoot
            ? { footVariant: footVariant || headVariant || null }
            : { headVariant: headVariant || null },
          key: isFoot ? 'bv-tfoot' : 'bv-thead',
        },
        $trs
      )
    },
  },
})
</script>

<style lang="scss">
// Extended Style
@import '../../@core/scss/base/core/colors/palette-variables.scss';

.dropdown-menu {
  z-index: 10000;
}

.item_tr {
  -webkit-transition: all 0.2s, border-color 0s;
  transition: all 0.2s, border-color 0s;
  position: relative;

  &:hover {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-box-shadow: 0 3px 10px 0 #ebe9f1;
    box-shadow: 0 3px 10px 0 #ebe9f1;
    background: $white;
    z-index: 20;

    .item_td_draggable_hover {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .item_td_draggable_hover {
    position: absolute;
    display: none;
    width: 1rem;
    height: 1rem;
    left: 0.75rem;
  }
}
</style>
