<template>
  <div>
    <b-form-textarea
      ref="textareaRef"
      v-model="modelValue"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      no-resize
      :rows="field.rows"
      :disabled="disabled"
      :maxlength="field.maxLength"
      :class="{ 'auto-height': field.autoHeight }"
      @blur="onBlur"
      @input="setHeightByContent"
    />

    <small v-if="field.counter" class="textarea-counter-value float-right">
      <span class="char-count">{{ enteredValueLength }}</span> / {{ field.maxLength }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { TextareaBaseField } from '../../../../@model/baseField'
import { trimEdges } from '../../../../helpers'

type TextareaFieldProps = {
  value?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  value: '',
  errors: () => [],
})

const onBlur = () => {
  emit('input', trimEdges(modelValue.value))
}

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const enteredValueLength = computed(() => (modelValue.value ? modelValue.value.length : 0))

const textareaRef = ref(null)
const setHeightByContent = () => {
  const textareaEl = textareaRef.value?.$el
  if (!textareaEl || !props.field.autoHeight) return
  textareaEl.style.height = '0px'
  nextTick(() => {
    textareaEl.style.height = textareaEl.scrollHeight + 4 + 'px'
  })
}

onMounted(() => {
  setTimeout(() => {
    setHeightByContent()
  })
})
</script>

<style lang="scss" scoped>
.auto-height {
  line-height: 1.45rem !important;
  padding: 0.438rem 1rem !important;
  min-height: 0px;
  resize: none;
  overflow: hidden;
  max-height: 1000px;
}
</style>
