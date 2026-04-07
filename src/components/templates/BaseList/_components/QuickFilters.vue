<script setup lang="ts">
import { ref } from 'vue'
import type { BaseField } from '../../../../@model/templates/baseField'
import { useFilters } from '../../../../components/FiltersBlock/useFilters'
import FieldGenerator from '@/components/templates/FieldGenerator/index.vue'
import { VSizes } from '@/@model/vuetify'

defineOptions({
  name: 'QuickFilters',
})

const props = withDefaults(defineProps<Props>(), {
  size: VSizes.Medium,
})

const { filters } = useFilters(props.filters)

const filterFields = ref(filters)

interface Props {
  filters: BaseField[]
  size: VSizes
}
</script>

<template>
  <div>
    <div class="d-flex items-center flex-start">
      <div
        v-for="(_, index) in filterFields"
        :key="filterFields.id"
        :class="{
          'date-field-width': 'DateField' === filterFields[index].component.__name,
          'ml-4': index,
        }"
      >
        <FieldGenerator
          v-model="filterFields[index]"
          :with-label="false"
          :size="size"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .date-field-width {
    width: 320px;
  }
</style>
