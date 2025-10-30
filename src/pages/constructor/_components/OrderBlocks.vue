<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import {IconsList} from "@/@model/enums/icons";

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
  <div class="d-flex align-center">
    <div class="d-flex align-center pl-2">
      <div class="pr-1">
        Order
      </div>
      <VTooltip activator="parent">
        Drag for change order of blocks
      </VTooltip></div>

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
  </div>
</template>
