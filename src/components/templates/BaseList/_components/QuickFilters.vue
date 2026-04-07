<script setup lang="ts">
import { onMounted, ref, watch, onBeforeMount } from 'vue'
import type { BaseField } from '../../../../@model/templates/baseField'
import { useFilters } from '../../../../components/FiltersBlock/useFilters'
import FieldGenerator from '../../../../components/templates/FieldGenerator/index.vue'
import { VSizes } from '../../../../@model/vuetify'
import { transformFormData } from '../../../../helpers'

defineOptions({
  name: 'QuickFilters',
})

const props = withDefaults(defineProps<Props>(), {
  size: VSizes.Medium,
})

const emits = defineEmits<{
  (e: 'change'): [Record<string, unknown>]
}>()

const { filters } = useFilters(props.filters)

const filterFields = ref(filters)

interface Props {
  filters: BaseField[]
  size: VSizes
}

const getFilterValue = fields => {
  const data = {}

  Object
    .values(fields)
    .forEach(field => {
      data[field.key] = field
    })

  console.log('FILTER VALUE', data)
  emits('change', transformFormData(data))
}

onBeforeMount(() => getFilterValue(filterFields.value))

// watch(() => filterFields.value, getFilterValue, {
//   deep: true,
// })
</script>

<template>
  <div>
    <div class="d-flex items-center flex-start">
      <div
        v-for="(_, index) in filterFields"
        :key="filterFields.id"
        :data-quick-filter="filterFields[index].key"
        :class="{
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
