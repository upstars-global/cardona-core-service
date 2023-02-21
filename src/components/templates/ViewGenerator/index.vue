<template>
  <div v-if="canView">
    <component
      :is="`${value.type}-view`"
      :item="value"
      :row-classes="rowClasses"
      :justify-class="justifyClass"
    />

    <hr v-if="value.withSeparator" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { getters } from '@/store'
import { ViewInfo, ViewJustifyContent, ViewSize } from '@model/view'
import TextView from './_components/TextView.vue'
import BadgesView from './_components/BadgesView.vue'
import BadgeIdView from './_components/BadgeIdView.vue'
import StatusView from './_components/StatusView.vue'
import StatusWithDateView from './_components/StatusWithDateView.vue'
import StatusWithDateHistoryView from './_components/StatusWithDateHistoryView.vue'
import StatementView from './_components/StatementView.vue'
import LinkView from './_components/LinkView.vue'
import BadgeCopyView from './_components/BadgeCopyView.vue'
import DateView from './_components/DateView.vue'
import SumAndCurrencyView from './_components/SumAndCurrencyView.vue'
import CommentView from './_components/CommentView.vue'
import TransactionTypeView from './_components/TransactionTypeView.vue'
import BalanceTableView from './_components/BalanceTableView.vue'
import ObjectToRowsView from './_components/ObjectToRowsView.vue'

export default defineComponent({
  name: 'ViewGenerator',
  components: {
    TextView,
    BadgeIdView,
    BadgesView,
    StatusView,
    StatusWithDateView,
    StatusWithDateHistoryView,
    StatementView,
    LinkView,
    BadgeCopyView,
    DateView,
    SumAndCurrencyView,
    CommentView,
    TransactionTypeView,
    BalanceTableView,
    ObjectToRowsView,
  },

  props: {
    value: {
      type: Object as PropType<ViewInfo>,
      required: true,
    },
    size: {
      type: String as PropType<ViewSize>,
      default: ViewSize.Md,
    },
    justifyContent: {
      type: String as PropType<ViewJustifyContent>,
      default: ViewJustifyContent.Start,
    },
  },

  setup(props) {
    const canView = computed<boolean>(() =>
      props.value.permission ? getters.abilityCan(props.value.permission, 'view') : true
    )
    const isSmallSize = computed(() => props.size === ViewSize.Sm)
    const justifyClass = computed(() => `justify-content-${props.justifyContent}`)
    const rowClasses = computed(() => ({
      'font-small-3': isSmallSize.value,
    }))
    return {
      canView,
      justifyClass,
      rowClasses,
    }
  },
})
</script>
