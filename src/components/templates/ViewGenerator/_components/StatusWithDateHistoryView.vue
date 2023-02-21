<script setup lang="ts">
import { ViewInfo } from '@model/view'
import StatusWithDateField from '@/components/templates/BaseList/_components/StatusWithDateField.vue'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()
</script>

<template>
  <b-row :class="rowClasses">
    <b-col>
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col :class="justifyClass">
      <status-with-date-field
        v-for="(data, index) in item.value"
        :key="index"
        :item="data"
        class="status-history"
      />
    </b-col>
  </b-row>
</template>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_variables.scss';

.status-history::v-deep {
  flex-direction: row;
  font-weight: $font-weight-bolder;
  justify-content: end;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .badge {
    margin-right: 0.5rem;
  }
}
</style>


