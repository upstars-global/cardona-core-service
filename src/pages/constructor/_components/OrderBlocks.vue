<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'

defineOptions({
  name: 'OrderBlocks',
})

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

interface Props {
  modelValue: { name: string; order: number }[]
}

const value = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value.map((item, index) => ({ ...item, order: index + 1 })))
  },
})
</script>

<template>
  <span class="pl-2">Order
    <VTooltip activator="parent">
      Change order of blocks
    </VTooltip></span>

  <VueDraggableNext v-model="value">
    <VBtn
      v-for="block in value"
      :key="block.name"
      class="cursor-grab ml-2"
      :size="VSizes.Small"
      label
      :color="VColors.Success"
      :variant="VVariants.Outlined"
    >
      <VIcon :icon="block.name" />
    </VBtn>
  </VueDraggableNext>
</template>
