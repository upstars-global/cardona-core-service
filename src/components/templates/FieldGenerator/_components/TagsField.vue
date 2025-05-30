<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TagsBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors } from '../../../../@model/vuetify'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'

const props = defineProps<{
  modelValue?: Array<string>
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
const splitValue = computed(() => Array.from(new Set(inputValue.value.split(' ').filter(tag => !!tag && tag !== '/'))))

const duplicateTagsList = computed(() => {
  const tags = localModelValue.value

  return splitValue.value.filter(tag => tags.includes(tag))
})

const uniqueTagsList = computed(() => {
  const tags = localModelValue.value

  return splitValue.value.filter(tag => !tags.includes(tag))
})

const onAddValue = () => {
  if (!inputValue.value)
    return

  localModelValue.value = [...localModelValue.value, ...uniqueTagsList.value]
  inputValue.value = duplicateTagsList.value.join(' ')
}

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})

const errorTextField = computed(() => Boolean(props.errors || duplicateTagsList.value?.length))
</script>

<template>
  <div>
    <AppTextField
      v-model.trim="inputValue"
      :disabled="disabled"
      :placeholder="field.placeholder || field.label"
      :error="errorTextField"
      :append-inner-icon="appendInnerIcon"
      autocomplete="off"
      :autofocus="false"
      class="tags-field"
      @keydown.enter.stop="onAddValue"
      @keydown.space.stop="onAddValue"
    >
      <template #default>
        <VChip
          v-for="(tag, index) in localModelValue"
          :key="`tag_${tag}`"
          closable
          label
          :color="disabled ? VColors.Secondary : VColors.Primary"
          @click:close="onDelete(index)"
        >
          {{ tag }}
        </VChip>
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

<style lang="scss" scoped>
.tags-field {
  :deep(.v-text-field) {
    height: auto;
  }
  :deep(.v-field__input){
    gap: 0.5rem;
    input {
      min-width: 10rem;
    }
  }
  :deep(.text-secondary) {
    color: rgba(var(--v-theme-grey-500)) !important;
  }
}
</style>
