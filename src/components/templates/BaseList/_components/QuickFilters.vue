<script setup lang="ts">
import type { BaseField } from '../../../../@model/templates/baseField'

defineOptions({
  name: 'QuickFilters',
})

defineProps<Props>()

interface Props {
  filters: BaseField[]
}
</script>

<template>
  <div>
    QuickFilters
    <hr>
    {{ filters }}
  </div>
</template>
