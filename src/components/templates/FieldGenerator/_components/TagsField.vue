<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TagsBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors } from '../../../../@model/vuetify'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'

const props = defineProps<{
  modelValue: Array<string>
  field: TagsBaseField
  errors: boolean
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: Array<string>): void
}>()

const localModelValue = computed({
  get: () => props.modelValue || [],
  set: value => emits('update:modelValue', value),
})

const onDelete = (index: number) => {
  localModelValue.value = localModelValue.value.toSpliced(index, 1)
}

const inputValue = ref('')
const splitValue = computed(() => inputValue.value.split(' '))

const duplicateTagsList = computed(() => {
  const tags = localModelValue.value

  return splitValue.value.filter(tag => tags.includes(tag))
})

const uniqueTagsList = computed(() => {
  const tags = localModelValue.value

  return splitValue.value.filter(tag => !tags.includes(tag))
})

const onAddValue = () => {
  localModelValue.value = [...localModelValue.value, ...uniqueTagsList.value]
  inputValue.value = duplicateTagsList.value.join(' ')
}

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})
</script>

<template>
  <div>
    <AppTextField
      v-model.trim="inputValue"
      :disabled="disabled"
      :placeholder="field.placeholder || field.label"
      :error="errors || duplicateTagsList.length"
      :append-inner-icon="appendInnerIcon"
      autocomplete="off"
      :autofocus="false"
      @keydown.enter.stop="onAddValue"
      @keydown.space.stop="onAddValue"
    >
      <template #prepend-inner>
        <div class="d-flex align-center gap-2">
          <VChip
            v-for="(tag, index) in localModelValue"
            :key="`tag_${index}`"
            closable
            label
            :color="VColors.Primary"
            @click:close="onDelete(index)"
          >
            {{ tag }}
          </VChip>
        </div>
      </template>
    </AppTextField>
    <p
      v-if="duplicateTagsList.length"
      class="text-caption text-error mt-1 mb-0 d-flex gap-1"
    >
      <span>{{ $t('component.tags.duplicateTag') }}</span>
      <span
        v-for="tag in duplicateTagsList"
        :key="tag"
      >
        {{ tag }}
      </span>
    </p>
  </div>
</template>
