<script setup lang="ts">
import type { EmitEvents, OptionsItem } from '../@model'
import { VColors } from '../@model/vuetify'
import { IconsList } from '../@model/enums/icons'

defineOptions({
  name: 'BadgeToggleGroup',
})

const props = defineProps<Props>()

const emit = defineEmits<EmitEvents<{
  'update:modelValue': OptionsItem[]
}>>()

interface Props {
  label: string
  modelValue: OptionsItem[]
  options: OptionsItem[]
}

const setState = (option: OptionsItem) => {
  const exists = props.modelValue.find(item => item.id === option.id)

  let newValue: OptionsItem[] = []

  if (exists)
    newValue = props.modelValue.filter(item => item.id !== option.id)
  else
    newValue = [...props.modelValue, option]

  emit('update:modelValue', newValue)
}

const isChecked = (option: OptionsItem): boolean => {
  return !!props.modelValue.find(item => item.id === option.id)
}
</script>

<template>
  <div class="d-flex align-items-center">
    <div class="text-h6 label">
      {{ label }}
    </div>
    <div class="ml-2">
      <VChip
        v-for="option in options"
        :key="option.id"
        label
        :color="isChecked(option) ? VColors.Primary : VColors.Secondary"
        class="mr-1"
        @click="setState(option)"
      >
        <span>
          <VIcon
            v-if="isChecked(option)"
            :icon="IconsList.EyeIcon"
          />
          <VIcon
            v-else
            :icon="IconsList.EyeOffIcon"
          />
        </span>
        <span>
          {{ option.name }}
        </span>
      </VChip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.label {
  font-weight: 600;
}
</style>
