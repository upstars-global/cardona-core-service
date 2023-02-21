<script setup lang="ts">
import { ViewInfo } from '@model/view'
import { computed, ref } from 'vue'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()

const localSearch = ref('')

const filteredList = computed(() => {
  if (!props.item.withSearch || localSearch.value === '') return props.item.value

  return props.item.value.filter((item) => {
    return item.name.startsWith(localSearch.value)
  })
})
</script>

<template>
  <div>
    <b-row :class="rowClasses">
      <b-col>
        <span>
          {{ item.label }}
        </span>
      </b-col>

      <b-col class="font-weight-bolder d-flex" :class="justifyClass">
        <b-badge variant="light-primary">{{ item.value.length }}</b-badge>
      </b-col>
    </b-row>

    <div v-if="item.withSearch" class="mt-1 mb-1">
      <b-input-group size="sm" class="input-group-merge search-group">
        <b-input-group-prepend is-text>
          <feather-icon icon="SearchIcon" />
        </b-input-group-prepend>

        <b-form-input v-model="localSearch" :placeholder="$t('placeholder.search._')" />
      </b-input-group>
    </div>

    <div class="mt-50">
      <b-badge
        v-for="(itemArr, key) in filteredList"
        :key="key"
        variant="light-secondary"
        class="mr-50 mb-50"
      >
        {{ itemArr.name }}
      </b-badge>
    </div>
  </div>
</template>


