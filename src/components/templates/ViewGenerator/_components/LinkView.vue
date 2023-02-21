<script setup lang="ts">
import { computed } from 'vue'
import { getters } from '@/store'
import { ViewInfo } from '@model/view'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()

const canUpdate = computed<boolean>(() =>
  props.item.permission ? getters.abilityCan(props.item.permission, 'update') : true
)
</script>

<template>
  <b-row :class="rowClasses">
    <b-col>
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="font-weight-bolder d-flex align-items-start" :class="justifyClass">
      <b-link
        v-b-modal="item.value.modalId"
        :to="item.value.route"
        :disabled="!canUpdate"
        :class="{ 'text-muted': !canUpdate }"
      >
        {{ item.value.title }}
      </b-link>
    </b-col>
  </b-row>
</template>

