<template>
  <b-form-tags
    v-model="modelValue"
    separator=" "
    :placeholder="field.placeholder"
    :disabled="disabled"
    :state="errors.isNotEmpty ? false : null"
    class="tags-field"
    :duplicate-tag-text="$t('component.tags.duplicateTag')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TagsBaseField } from '../../../../@model/baseField'

type TagsFieldProps = {
  value: string[]
  field: TagsBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<TagsFieldProps>(), {
  value: () => [],
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string[]): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../../../../assets/scss/style.scss';

.tags-field {
  :deep(.b-form-tag) {
    background-color: $bg-light-purple;
    color: $purple;
    font-weight: $font-weight-bold;
    font-size: 0.9rem;
  }

  :deep(.b-form-tags-button) {
    display: none;
  }
}
</style>
