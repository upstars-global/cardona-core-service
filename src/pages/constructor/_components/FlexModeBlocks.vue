<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import { IconsList } from '../../../@model/enums/icons'

defineOptions({
  name: 'FlexModeBlocks',
})

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

enum FlexMode {
  Row = 'row',
  Column = 'column',
}
interface Props {
  modelValue: FlexMode
}

const value = computed({
  get: () => props.modelValue || FlexMode.Row,
  set: value => {
    emit('update:modelValue', value)
  },
})

const getVariant = (mode: FlexMode) => mode === value.value ? VVariants.Flat : VVariants.Outlined
</script>

<template>
  <span>Column mode</span>
  <div>
    <VBtn
      :value="FlexMode.Row"
      :variant="getVariant(FlexMode.Row)"
      :color="VColors.Success"
      :size="VSizes.Small"
      @click="value = FlexMode.Row"
    >
      <VIcon
        :variant="VVariants.Outlined"
        :icon="IconsList.LayoutRows"
      />
    </VBtn>
    <VBtn
      :variant="getVariant(FlexMode.Column)"
      :value="FlexMode.Column"
      :color="VColors.Success"
      :size="VSizes.Small"
      @click="value = FlexMode.Column"
    >
      <VIcon
        :variant="VVariants.Outlined"
        :icon="IconsList.LayoutColumns"
      />
    </VBtn>
  </div>
</template>
