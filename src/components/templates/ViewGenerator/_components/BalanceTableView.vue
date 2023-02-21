<script setup lang="ts">
import { ViewInfo } from '@model/view'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div>
    <div class="font-weight-bolder text-uppercase mb-1">
      {{ item.label }}
    </div>

    <b-row class="justify-content-between align-items-center mb-1">
      <b-col md="6" class="table-label">
        {{ $t('common.sum') }}
      </b-col>
      <b-col md="6" class="text-right">
        <span :key="uuidv4()" v-currency="item?.value?.sum" />
      </b-col>
    </b-row>

    <b-row class="justify-content-between align-items-center mb-1">
      <b-col md="6" class="table-label">
        {{ $t('common.before') }}
      </b-col>
      <b-col md="6" class="text-right">
        <span :key="uuidv4()" v-currency="item?.value?.before" />
      </b-col>
    </b-row>

    <b-row class="justify-content-between align-items-center mb-1">
      <b-col md="6" class="table-label">
        {{ $t('common.after') }}
      </b-col>
      <b-col md="6" class="text-right">
        <span :key="uuidv4()" v-currency="item?.value?.after" />
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_include';

.table-label {
  color: $headings-color;
}
</style>
