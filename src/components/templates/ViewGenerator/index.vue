<template>
  <div v-if="canView">
    <b-row class="font-small-3">
      <b-col :cols="cols">
        <div v-if="value.icon !== undefined" class="icon-block">
          <feather-icon v-if="value.icon" :icon="value.icon" />
        </div>

        <label class="mb-0">{{ value.label }}</label>
      </b-col>
      <b-col
        :cols="valueColsCount"
        class="font-weight-bolder d-flex align-items-start text-break"
        :class="justifyClass"
      >
        <slot :name="`sidebar-value(${keyName})`">
          <component :is="`${value.type}-view`" :item="value" />
        </slot>
      </b-col>
    </b-row>
    <hr v-if="value.withSeparator" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { getters } from '@/store'
import { ViewInfo, ViewJustifyContent } from '@model/view'
import TextView from './_components/TextView.vue'
import BadgesView from './_components/BadgesView.vue'
import BadgeView from './_components/BadgeView.vue'
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
import ObjectToRowsView from './_components/ObjectToRowsView.vue'
import LocaleView from './_components/LocaleView.vue'
import RegionView from '@/components/templates/ViewGenerator/_components/RegionView.vue'

export default defineComponent({
  name: 'ViewGenerator',
  components: {
    TextView,
    BadgeView,
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
    ObjectToRowsView,
    LocaleView,
    RegionView,
  },

  props: {
    value: {
      type: Object as PropType<ViewInfo>,
      required: true,
    },
    keyName: {
      type: String,
      default: '',
    },
    justifyContent: {
      type: String as PropType<ViewJustifyContent>,
      default: ViewJustifyContent.Start,
    },
    cols: {
      type: Number,
      default: 4,
    },
  },

  setup(props) {
    const canView = computed<boolean>(() =>
      props.value.permission ? getters.abilityCan(props.value.permission, 'view') : true
    )
    const justifyClass = computed(() => `justify-content-${props.justifyContent}`)
    const valueColsCount = computed(() => 12 - props.cols)

    return {
      canView,
      justifyClass,
      valueColsCount,
    }
  },
})
</script>


<style lang="scss" scoped>
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>

